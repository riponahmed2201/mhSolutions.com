import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Upload, Button } from 'antd';
import ImgCrop from "antd-img-crop";
import { UploadOutlined } from '@ant-design/icons';

import { responseNotification } from '../../../utils/notifcation';
import defaultImage from '../../../assets/images/default.png';
import { imageUploadHandler } from '../../../api/employee/profileUpdateImage';

function ProfileUpdate() {

  const [cv, setCV] = useState([]);
  const [profilePicture, setProfilePicture] = useState([]);
  const [summaryPdf, setSummaryPdf] = useState([]);
  const [summaryPdfFileShow, setSummaryPdfFileShow] = useState(undefined);

  const [loading, setLoading] = useState(false);
  const [getError, setError] = useState();

  const navigate = useNavigate();

  const onProfileChange = ({ fileList: newFileList }) => {
    setProfilePicture(newFileList);
  };

  // image preview
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const onFinish = async () => {

    if (true) {
      setLoading(true);

      const file = new FormData();
      file.append("cv", summaryPdf?.[0].originFileObj);
      file.append("profilePicture", profilePicture?.[0].originFileObj);
      file.append("id", "640b0b4f1daedb1b0c821802");

      await imageUploadHandler(file)
        .then((res) => res.json())
        .then((res) => {
          console.log("Response: ", res);
          if (res.statusCode === 200) {
            responseNotification("Profile updated successfully", "success");
            setCV([]);
            setSummaryPdf([]);
            setProfilePicture([]);

            navigate('/employee-certificate-update');

            // window.location.reload();
          } else if (res?.statusCode === 400) {
            responseNotification(
              "Bad request please upload valid file or check you internet",
              "warning"
            );
            setError(res?.errors?.[0]?.msg);
            setLoading(false);
          } else {
            setLoading(false);
            setError(res?.message);
          }
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  };

  //CV onchange
  const summaryPdfChange = ({ fileList: newFileList }) => {
    setSummaryPdf(newFileList);
    setSummaryPdfFileShow(newFileList[0]?.originFileObj?.name);
  };

  return (
    <div className='row'>
      <div className='col-md-6 col-sm-12' style={{ background: "#f7f7fc", minHeight: '100vh' }}>
        <div style={{ padding: "20px 30px" }}>
          <br />
          <br />
          <h2 className='class="mt-40 text-center mb-25'>WELCOME TO MH PREMIER STAFFING SOLUTIONS</h2>
          <div className='mt-5' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', justifyItems: 'center' }}>
            <img style={{ width: 'auto', height: 'auto', objectFit: "cover" }} src='logo.png' alt='img' />
          </div>
        </div>
      </div>
      <div className='col-md-6 col-sm-12' style={{ background: "#ffffff" }}>
        <div className='bg-white'>
          <div className="container-fluid">
            <nav className="navbar navbar-expand-lg navbar-light">

              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item active">
                    <Link className="nav-link" to="/client-register">Client Register</Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/employee-register">Employee Register</Link>
                  </li>
                </ul>
              </div>
            </nav>
            <br />

            <h4 className='text-left mb-4'>Employee Profile Update</h4>

            <Form
              className="ant-form ant-form-vertical"
              layout="vertical"
              onFinish={onFinish}
            >
              <div className='col-12'>
                <div className='row'>

                  <div className="col-md-6">
                    <Form.Item name="profilePicture" label="Profile Picture">
                      <ImgCrop rotate aspect={2 / 1}>
                        <Upload
                          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                          listType="picture-card"
                          fileList={profilePicture}
                          onChange={onProfileChange}
                          onPreview={onPreview}
                        >
                          {profilePicture?.length < 1 && (<><img style={{ height: '60px', width: '60px' }} src={defaultImage} alt="Default Image" /></>)}
                        </Upload>
                      </ImgCrop>
                    </Form.Item>
                  </div>

                  <div className="col-md-6">
                    <Form.Item name="summaryPdf" className="p-1 m-0" label="Curriculam Vitea (CV)">
                      <Upload
                        listType="picture"
                        defaultFileList={[...summaryPdf]}
                        fileList={summaryPdf}
                        onChange={summaryPdfChange}
                        maxCount={1}
                        accept=".pdf, .PDF, docs, DOCS, .doc, .DOC, .docx"
                      >
                        <Button icon={<UploadOutlined />}>
                          {" "}
                          {!summaryPdfFileShow ? "Upload" : "Uploaded"}{" "}
                        </Button>
                      </Upload>

                    </Form.Item>
                  </div>
                </div>
              </div>

              {getError ? (
                <div className="row">
                  <div className="col-lg-12">
                    <div className="error-message">
                      <p className="text-danger">{getError}</p>
                    </div>
                  </div>
                </div>
              ) : undefined}

              <div className="col-md-6">
                <Form.Item>
                  <button
                    disabled={loading}
                    className="btn"
                    style={{ background: '#C6A34F', color: 'white' }}
                    type="submit"
                  >
                    {!loading && "Continue"}
                    {loading && (
                      <span
                        className="indicator-progress"
                        style={{ display: "block" }}
                      >
                        Please wait...{" "}
                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                      </span>
                    )}
                  </button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileUpdate