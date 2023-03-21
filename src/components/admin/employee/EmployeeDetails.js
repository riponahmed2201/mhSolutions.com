
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Form, Select, Input, DatePicker, Space } from 'antd';

import moment from "moment";
import _ from "lodash";

import { token } from '../../../utils/authentication';
import { responseNotification } from '../../../utils/notifcation';
import { fetchReferPersonListForDropdownHandler } from '../../../api/employee';
import { fetchSkillListForDropdownHandler } from '../../../api/skill';
import { fetchPositionListForDropdownHandler } from '../../../api/position';
import { fetchSourceListForDropdownHandler } from '../../../api/source';
import { staticLanguageName } from '../../../utils/static/languageList';
import CountryWiseValidationRules from '../../../utils/static/countryList';

const { Option } = Select;

function EmployeeDetails() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [getSingleEmployeeDetails, setSingleEmployeeDetails] = useState([]);
    const [referPerson, setReferPerson] = useState([]);
    const [skill, setSkill] = useState([]);
    const [position, setPosition] = useState([]);
    const [sourceFrom, setSourceFrom] = useState([]);
    const [loading, setLoading] = useState(false);
    const [getError, setError] = useState();
    const [getDateOfBirth, setDateOfBirth] = useState(undefined);

    const [form] = Form.useForm();

    //Fetch refer person list for dropdown
    const fetchSingleEmployeeData = useCallback(async () => {

        try {

            const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/users/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token()}`,
                    },
                }
            );

            form.setFieldsValue({

                //Employee Basic Information
                name: res?.data?.details.name,
                email: res?.data?.details.email,
                phoneNumber: res?.data?.details.phoneNumber,
                positionId: res?.data?.details.positionId,
                gender: res?.data?.details.gender,
                dateOfBirth: res?.data?.details.dateOfBirth,
                presentAddress: res?.data?.details.presentAddress,
                permanentAddress: res?.data?.details.permanentAddress,
                countryName: res?.data?.details.countryName,
                higherEducation: res?.data?.details.higherEducation,
                licensesNo: res?.data?.details.licensesNo,
                emmergencyContact: res?.data?.details.emmergencyContact,
                employeeExperience: res?.data?.details.employeeExperience,
                languages: res?.data?.details.languages,
                skills: res?.data?.details.skills,
                sourceId: res?.data?.details.sourceId,
                referPersonId: res?.data?.details.referPersonId,

                //bank information
                bankName: res?.data?.details.bankName,
                accountNumber: res?.data?.details.accountNumber,
                routingNumber: res?.data?.details.routingNumber,
                dressSize: res?.data?.details.dressSize,
                additionalOne: res?.data?.details.additionalOne,
                additionalTwo: res?.data?.details.additionalTwo
            });

            setSingleEmployeeDetails(res?.data?.details);

        } catch (error) {

        }

    }, []);

    useEffect(() => {
        fetchSingleEmployeeData();
    }, [id]);

    const onFinish = async (values) => {

        const receivedEmployeeFields = {
            id: id,
            bankName: values?.bankName,
            accountNumber: values?.accountNumber,
            routingNumber: values?.routingNumber,
        };

        if (values?.dressSize) receivedEmployeeFields.dressSize = values?.dressSize;
        if (values?.additionalOne) receivedEmployeeFields.additionalOne = values?.additionalOne;
        if (values?.additionalTwo) receivedEmployeeFields.additionalTwo = values?.additionalTwo;

        try {

            setLoading(true);

            const res = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/users/update-bank-dress`, receivedEmployeeFields);

            if (res?.data?.statusCode === 200) {
                setError(undefined);
                setLoading(false);
                responseNotification("Employee bank updated successfully!", "success");

            } else if (res?.data?.statusCode === 400) {
                setError(res?.data?.errors?.[0].msg);
                setLoading(false);
            } else if (res?.data?.statusCode === 500) {
                setError(res?.message);
                setLoading(false);
            }

        } catch (error) {
            setError(error?.response?.data?.errors?.[0].msg);
            setLoading(false);
        }
    };

    //Fetch refer person list for dropdown
    const fetchReferPersonData = useCallback(async () => {
        await fetchReferPersonListForDropdownHandler().then((res) => {
            setReferPerson(res?.data?.users);
        });
    }, []);

    //Fetch skill list for dropdown
    const fetchSkillData = useCallback(async () => {
        await fetchSkillListForDropdownHandler().then((res) => {
            setSkill(res?.data?.skills);
        });
    }, []);

    //Fetch position list for dropdown
    const fetchPositionData = useCallback(async () => {
        await fetchPositionListForDropdownHandler().then((res) => {
            setPosition(res?.data?.positions);
        });
    }, []);

    //Fetch source list for dropdown
    const fetchSourceFromData = useCallback(async () => {
        await fetchSourceListForDropdownHandler().then((res) => {
            setSourceFrom(res?.data?.sources);
        });
    }, []);

    useEffect(() => {
        fetchSkillData();
        fetchPositionData();
        fetchSourceFromData();
        fetchReferPersonData();
    }, []);

    const onFinishBasicInfoUpdate = async (values) => {

        const dateOfBirthFromOnchanage = getDateOfBirth ? moment(getDateOfBirth).format("YYYY-MM-DD").valueOf() : undefined;

        const receivedEmployeeFields = {
            name: values?.name,
            email: values?.email,
            phoneNumber: values?.phoneNumber,
            countryName: values?.countryName,
            dateOfBirth: dateOfBirthFromOnchanage,
            emmergencyContact: values?.emmergencyContact,
            gender: values?.gender,
            higherEducation: values?.higherEducation,
            languages: values?.languages,
            licensesNo: values?.licensesNo,
            permanentAddress: values?.permanentAddress,
            positionId: values?.positionId,
            presentAddress: values?.presentAddress,
            referPersonId: values?.referPersonId,
            skills: values?.skills,
            sourceId: values?.sourceId,
            employeeExperience: Number(values?.employeeExperience)

            // values.dateOfBirth
        };

        try {

            setLoading(true);

            const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/update-employee`, receivedEmployeeFields);

            if (res?.data?.statusCode === 200) {
                setError(undefined);
                setLoading(false);
                responseNotification("Employee information updated successfully!", "success");
                // form.resetFields();

            } else if (res?.data?.statusCode === 400) {
                setError(res?.data?.errors?.[0].msg);
                setLoading(false);
            } else if (res?.data?.statusCode === 500) {
                setError(res?.message);
                setLoading(false);
            }

        } catch (error) {
            setError(error?.response?.data?.errors?.[0].msg);
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid px-4">
            <div className='row mt-4'>
                <div className='d-flex justify-content-between'>
                    <h3 className='mb-4 title'>Employee Information</h3>
                </div>
            </div>

            <div className='card'>
                <div className='card-header'>
                    Employee Profile Info
                </div>
                <div className='card-body'>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <td style={{ width: '200px' }}> <img style={{ width: '100px', height: '100px', borderRadius: '50%' }} src={`${process.env.REACT_APP_ASSETs_BASE_URL}/` + getSingleEmployeeDetails?.profilePicture} /> </td>
                                <td> <a target='_blank' href={`${process.env.REACT_APP_ASSETs_BASE_URL}/` + getSingleEmployeeDetails?.cv}>Curriculum Vitae (CV)</a> </td>
                            </tr>
                        </thead>
                    </table>
                    <br />

                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Certificate Name</th>
                                <th>Certificate File</th>
                            </tr>
                        </thead>
                        <tbody>

                            {_.map(getSingleEmployeeDetails?.certificates, (item, index) => (
                                <tr key={index}>
                                    <td>{item?.certificateName}</td>
                                    <td>
                                        <img style={{ width: '100px', height: '100px' }} src={`${process.env.REACT_APP_ASSETs_BASE_URL}/` + item?.attachment} />
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
            <br />
            <div className='card'>

                <div className='card-header'>
                    Update Employee Information
                </div>

                <div className='card-body'>
                    <Form
                        className="ant-form ant-form-vertical"
                        layout="vertical"
                        onFinish={onFinishBasicInfoUpdate}
                        form={form}
                    >
                        <div className='col-12'>
                            <div className='row'>

                                <div className="col-md-4">
                                    <Form.Item
                                        label="Name"
                                        name="name"
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter name',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Enter name" className="ant-input ant-input-lg" />
                                    </Form.Item>
                                </div>

                                <div className="col-md-4">
                                    <Form.Item
                                        label="Email"
                                        name="email"
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter email',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Enter email" className="ant-input ant-input-lg" />
                                    </Form.Item>
                                </div>

                                <div className="col-md-4">
                                    <Form.Item
                                        label="Phone number"
                                        name="phoneNumber"
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter phone number',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Enter phone number" className="ant-input ant-input-lg" />
                                    </Form.Item>
                                </div>

                                <div className="col-md-4">
                                    <Form.Item
                                        label="Position"
                                        name="positionId"
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter position',
                                            },
                                        ]}
                                    >
                                        <Select
                                            showSearch={true}
                                            placeholder="Please Select position"
                                            optionFilterProp="children"
                                        >
                                            {position?.map((item, index) => (
                                                <Option key={index} value={item?._id}>{item?.name}</Option>
                                            ))}

                                        </Select>
                                    </Form.Item>
                                </div>

                                <div className="col-md-4">
                                    <Form.Item
                                        label="Gender"
                                        name="gender"
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter gender',
                                            },
                                        ]}
                                    >
                                        <Select
                                            showSearch={true}
                                            placeholder="Please Select Gender"
                                            optionFilterProp="children"
                                        >
                                            <Option value="MALE">MALE</Option>
                                            <Option value="FEMALE">FEMALE</Option>
                                        </Select>
                                    </Form.Item>
                                </div>

                                <div className="col-md-4">
                                    <Form.Item
                                        label="Date Of Birth"
                                        name="dateOfBirth"
                                        rules={[
                                            {
                                                // required: true,
                                                message: 'Please enter date of birth',
                                            },
                                        ]}
                                    >
                                        <Space direction="vertical" style={{
                                            width: '100%',
                                        }}>

                                            <DatePicker
                                                style={{ width: '100%' }}
                                                id="dateOfBirth"
                                                placeholder="Date of Birth"
                                                onChange={(value) => {
                                                    setDateOfBirth(
                                                        moment(value)
                                                            .format("YYYY-MM-DD")
                                                            .valueOf()
                                                    );
                                                }}
                                            />

                                        </Space>
                                    </Form.Item>
                                </div>

                                <div className="col-md-4">
                                    <Form.Item
                                        label="Present Address"
                                        name="presentAddress"
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter present address',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Enter present address" className="ant-input ant-input-lg" />
                                    </Form.Item>
                                </div>

                                <div className="col-md-4">
                                    <Form.Item
                                        label="Permanent Address"
                                        name="permanentAddress"
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter your permanent address',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Enter your permanent address" className="ant-input ant-input-lg" />
                                    </Form.Item>
                                </div>

                                <div className="col-md-4">
                                    <Form.Item
                                        label="Country Name"
                                        name="countryName"
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter country name',
                                            },
                                        ]}
                                    >
                                        <Select
                                            showSearch={true}
                                            placeholder="Please Select Country Name"
                                            optionFilterProp="children"
                                        >
                                            {CountryWiseValidationRules?.map((item, index) => (
                                                <Option key={index} value={item?.name}>{item?.name}</Option>
                                            ))}

                                        </Select>
                                    </Form.Item>
                                </div>

                                <div className="col-md-4">
                                    <Form.Item
                                        label="Higher Education"
                                        name="higherEducation"
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter higher education',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Enter higher education" className="ant-input ant-input-lg" />
                                    </Form.Item>
                                </div>

                                <div className="col-md-4">
                                    <Form.Item
                                        label="Licenses No"
                                        name="licensesNo"
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter licenses no',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Enter licenses no" className="ant-input ant-input-lg" />
                                    </Form.Item>
                                </div>

                                <div className="col-md-4">
                                    <Form.Item
                                        label="Emmergency Contact"
                                        name="emmergencyContact"
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter emmergency contact',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Enter emmergency contact" className="ant-input ant-input-lg" />
                                    </Form.Item>
                                </div>

                                <div className="col-md-4">
                                    <Form.Item
                                        label="Employee Experience"
                                        name="employeeExperience"
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter employee experience',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Enter employee experience" className="ant-input ant-input-lg" />
                                    </Form.Item>
                                </div>

                                <div className="col-md-4">
                                    <Form.Item
                                        label="Languages"
                                        name="languages"
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter languages',
                                            },
                                        ]}
                                    >
                                        <Select
                                            mode="multiple"
                                            showSearch={true}
                                            placeholder="Please Select languages"
                                            optionFilterProp="children"
                                        >
                                            {staticLanguageName?.map((item, index) => (
                                                <Option key={index} value={item?.name}>{item?.name}</Option>
                                            ))}

                                        </Select>
                                    </Form.Item>

                                </div>

                                <div className="col-md-4">
                                    <Form.Item
                                        label="Skills"
                                        name="skills"
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter skills',
                                            },
                                        ]}
                                    >
                                        <Select
                                            mode="multiple"
                                            showSearch={true}
                                            placeholder="Please Select Skill"
                                            optionFilterProp="children"
                                        >
                                            {skill?.map((skillName, index) => (
                                                <Option key={index} value={skillName?._id}>{skillName?.name}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                </div>

                                <div className="col-md-4">
                                    <Form.Item
                                        label="How You Know About Us?"
                                        name="sourceId"
                                        hasFeedback
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter how you know about us',
                                            },
                                        ]}
                                    >

                                        <Select
                                            showSearch={true}
                                            placeholder="Please Select"
                                            optionFilterProp="children"
                                        >

                                            {sourceFrom?.map((item, index) => (
                                                <Option key={index} value={item?._id}>{item?.name}</Option>
                                            ))}

                                        </Select>
                                    </Form.Item>
                                </div>

                                <div className="col-md-4">
                                    <Form.Item
                                        label="Refer Person name"
                                        name="referPersonId"
                                        hasFeedback
                                    >
                                        <Select
                                            showSearch={true}
                                            placeholder="Please Select Refer Person"
                                            optionFilterProp="children"
                                        >
                                            {referPerson?.map((refer, index) => (
                                                <Option key={index} value={refer?._id}>{refer?.name}</Option>
                                            ))}
                                        </Select>
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

                        <div className="col-md-4">
                            <Form.Item>
                                <button
                                    disabled={loading}
                                    className="btn"
                                    style={{ background: '#C6A34F', color: 'white' }}
                                    type="submit"
                                >
                                    {!loading && "Update"}
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
            <br />

            <div className='card'>
                <div className='card-header'>
                    Bank and Dress Information
                </div>
                <div className='card-body'>
                    <div>
                        <Form
                            className="ant-form ant-form-vertical"
                            layout="vertical"
                            onFinish={onFinish}
                            form={form}
                        >
                            <div className='col-12'>
                                <div className='row'>
                                    <div className="col-md-4">
                                        <Form.Item
                                            label="Bank Name"
                                            name="bankName"
                                            hasFeedback
                                            initialValue={getSingleEmployeeDetails?.name}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please enter bank name',
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Enter bank name" className="ant-input ant-input-lg" />
                                        </Form.Item>
                                    </div>

                                    <div className="col-md-4">
                                        <Form.Item
                                            label="Account Number"
                                            name="accountNumber"
                                            hasFeedback
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please enter account number',
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Enter bank account number" className="ant-input ant-input-lg" />
                                        </Form.Item>
                                    </div>

                                    <div className="col-md-4">
                                        <Form.Item
                                            label="Routing Number"
                                            name="routingNumber"
                                            hasFeedback
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please enter routing number',
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Enter routing number" className="ant-input ant-input-lg" />
                                        </Form.Item>
                                    </div>
                                    <div className="col-md-4">
                                        <Form.Item
                                            label="Dress Size"
                                            name="dressSize"
                                            hasFeedback
                                            rules={[
                                                {
                                                    message: 'Please enter dress size',
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Enter dress size" className="ant-input ant-input-lg" />
                                        </Form.Item>
                                    </div>

                                    <div className="col-md-4">
                                        <Form.Item
                                            label="Additional One"
                                            name="additionalOne"
                                            hasFeedback
                                            rules={[
                                                {
                                                    message: 'Please enter additional one',
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Enter additional one" className="ant-input ant-input-lg" />
                                        </Form.Item>
                                    </div>

                                    <div className="col-md-4">
                                        <Form.Item
                                            label="Additional Two"
                                            name="additionalTwo"
                                            hasFeedback
                                            rules={[
                                                {
                                                    message: 'Please enter additional two',
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Enter additional two" className="ant-input ant-input-lg" />
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
                                        {!loading && "Update Bank"}
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

export default EmployeeDetails