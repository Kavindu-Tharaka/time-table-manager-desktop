import React, { useState, useEffect } from 'react';
import EmptyDataPlaceholder from '../EmptyDataPlacehoder/EmptyDataPlaceholder';
import ContentHeader from '../ContentHeader/ContentHeader';
import axios from 'axios';
import PreLoader from '../PreLoader/PreLoader';
import { store } from 'react-notifications-component';
import { buildToast } from '../../util/toast';
import { FaSpinner } from 'react-icons/fa';
import moment from 'moment';
import { IoMdAdd, IoMdAddCircleOutline } from 'react-icons/io';
import { IoMdClose, IoMdCreate } from 'react-icons/io';
import ConstraintConsecutiveSessionsTable from './ConstraintConsecutiveSessionsTable';
import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';

function ConstraintsConsecutiveSessions() {
	let sessionIdTemp;
	let subjectIdTemp;

	const [year, setYear] = useState('1');
	const [semester, setSemester] = useState('1');
	const [subject, setSubject] = useState('');
	const [sessionIDbehalfOfName, setSessionIDBehalfOfName] = useState('');
	const [subjectIDbehalfOfName, setSubjectIDBehalfOfName] = useState('');
	const [sessions, setSessions] = useState([]);
	const [
		consecutiveSessionsConstraintsList,
		setConsecutiveSessionsConstraintsList,
	] = useState([]);
	const [sessionAsString, setSessionAsString] = useState('');
	const [subjects, setSubjects] = useState([]);
	const [updateComponent, setUpdateComponent] = useState(0);
	const [loading, setLoading] = useState(true);
	const [isAdding, setIsAdding] = useState(false);

	const [sessionBucket, setSessionBucket] = useState([]);
	const [currentSession, setCurrentSession] = useState('');
	const [errorMsg, setErrorMsg] = useState('');
	const [isSessionvalid, setIsSessionValid] = useState(true);

	const refreshComponent = () => {
		setUpdateComponent(Math.random());
	};

	const onSessionChange = async (e) => {
		setCurrentSession(document.querySelector('#autoCompleteInput').value);

		const sessionName = document.querySelector('#autoCompleteInput').value;

		const session = sessions.find(
			(session) => session.asString === sessionName.trim()
		);

		setSessionIDBehalfOfName(session ? session._id : '');
		setErrorMsg('');
		setIsSessionValid(true);
	};

	const onSubjectChange = async (e) => {
		setSubject(e.target.value);

		// console.log(e.target.value);

		// await axios
		//     .get(`https://time-table-manager.herokuapp.com/api/v1/subjects/${e.target.value}`)
		//     .then(res => {
		//         setSubject(res.data.data.subject.subjectCode);
		//     })
		//     .catch(err => console.log(err));

		//     console.log('subject: ' + subject)
	};

	const onInputChangeYear = (e) => {
		setYear(e.target.value);
	};
	const onInputChangeSemester = (e) => {
		setSemester(e.target.value);
	};
	const removeLabel = (id) => {
		setSessionBucket((sessionBucket) =>
			sessionBucket.filter((session) => session._id !== id)
		);
		setErrorMsg('');
		setIsSessionValid(true);
	};

	const handleKeyDown = (e) => {
		if (e.keyCode === 13) {
			addToBucket();
		}
	};

	const addConstraint = () => {
		if (sessionBucket.length < 2) {
			setIsSessionValid(false);
			setErrorMsg('Consecutive Sessions Should be two or more Sessions!');
		} else {
			setIsAdding(true);

			axios
				.post(
					'https://time-table-manager.herokuapp.com/api/v1/constraintsconsecutivesessions',
					{
						// year: year,
						// semester: semester,
						// subject: subjectIDbehalfOfName,
						consecutivesessions: sessionBucket,
					}
				)
				.then((res) => {
					console.log(res.data.data.constraintsConsecutiveSession);
					setSessionBucket([]);
					refreshComponent();
					setIsAdding(false);
					store.addNotification(
						buildToast(
							'success',
							'Success',
							'Constraint Added Successfully'
						)
					);
					setCurrentSession('');
				})
				.catch((err) => console.log(err));
		}
	};

	const addToBucket = async () => {
		if (currentSession === '') {
			setIsSessionValid(false);
			setErrorMsg('Please Select a Session!');
		} else {
			await axios
				.get(
					`https://time-table-manager.herokuapp.com/api/v1/session/${sessionIDbehalfOfName}`
				)
				.then((res) => {
					if (res.data.data.session === undefined) {
						setCurrentSession('');
						setErrorMsg('You entered an Invalid Session!');
						setIsSessionValid(false);
					} else if (
						sessionBucket.find(
							(session) =>
								session._id === res.data.data.session._id
						)
					) {
						setCurrentSession('');
						setErrorMsg('Session is already added!');
						setIsSessionValid(false);
					} else if (
						!sessionBucket.find(
							(session) =>
								session._id === res.data.data.session._id
						)
					) {
						setSessionBucket([
							...sessionBucket,
							res.data.data.session,
						]);
						setCurrentSession('');
					}
				})
				.catch((err) => console.log(err));
		}
	};

	useEffect(() => {
		const CancelToken = axios.CancelToken;
		const source = CancelToken.source();

		const loadData = () => {
			axios
				.all(
					[
						axios.get(
							'https://time-table-manager.herokuapp.com/api/v1/session'
						),
						axios.get(
							'https://time-table-manager.herokuapp.com/api/v1/subjects'
						),
						axios.get(
							'https://time-table-manager.herokuapp.com/api/v1/constraintsconsecutivesessions'
						),
					],
					{
						cancelToken: source.token,
					}
				)
				.then((res) => {
					setConsecutiveSessionsConstraintsList(
						res[2].data.data.constraintsConsecutiveSessions
					);

					setSubjects(res[1].data.data.subjects);

					subjectIdTemp = res[1].data.data.subjects.find(
						(item) =>
							year == item.offeredYear &&
							semester == item.offeredSemester
					);

					setSubjectIDBehalfOfName(subjectIdTemp._id);
					setSubject(subjectIdTemp.subjectCode);

					setSessions(res[0].data.data.sessions);

					sessionIdTemp = res[0].data.data.sessions.find(
						(item) =>
							year == item.studentGroup.substring(1, 2) &&
							semester == item.studentGroup.substring(4, 5) &&
							subject == item.subjectcode
					);

					setSessionIDBehalfOfName(sessionIdTemp._id);

					setLoading(false);
				})
				.catch((err) => {
					console.log(err);
					setLoading(false);
				});
		};

		loadData();

		return () => {
			source.cancel();
		};
	}, [updateComponent, year, semester]);

	useEffect(() => {
		const CancelToken = axios.CancelToken;
		const source = CancelToken.source();

		const loadData = () => {
			axios
				.all(
					[
						axios.get(
							'https://time-table-manager.herokuapp.com/api/v1/session'
						),
					],
					{
						cancelToken: source.token,
					}
				)
				.then((res) => {
					setSessions(res[0].data.data.sessions);

					sessionIdTemp = res[0].data.data.sessions.find(
						(item) =>
							year == item.studentGroup.substring(1, 2) &&
							semester == item.studentGroup.substring(4, 5) &&
							subject == item.subjectCode
					);

					setSessionIDBehalfOfName(sessionIdTemp._id);

					setLoading(false);
				})
				.catch((err) => {
					console.log(err);
					setLoading(false);
				});
		};

		loadData();

		return () => {
			source.cancel();
		};
	}, [subject]);

	return (
		<div>
			<PreLoader loading={loading} hasSideBar={true} />
			<ContentHeader header={'Consecutive Sessions'} />
			<div
				style={{
					marginTop: '3%',
					paddingLeft: '1%',
					paddingRight: '1%',
				}}
			>
				{/* <div className="form-row">
                    <div className="form-group col-md-3">
                        <label>{'Year'}</label>
                        <select
                            className="custom-select"
                            value={year}
                            onChange={onInputChangeYear}
                        >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                    </div>
                    <div className="form-group col-md-3">
                        <label>{'Semester'}</label>
                        <select
                            className="custom-select"
                            value={semester}
                            onChange={onInputChangeSemester}
                        >
                            <option value="1">1</option>
                            <option value="2">2</option>
                        </select>
                    </div>

                    <div className="form-group col-md-6">
                        <label>Subject</label>
                        <select
                            className="custom-select"
                            onChange={onSubjectChange}
                            value={subject}
                        >
                            {subjects.map((item) =>
                                year == item.offeredYear &&
                                semester == item.offeredSemester ? (
                                    <option
                                        key={item._id}
                                        value={item.subjectCode}
                                    >
                                        {`${item.subjectCode} - ${item.subjectName}`}
                                    </option>
                                ) : null
                            )}
                        </select>
                    </div>
                </div> */}
				<div className='form-row'>
					<div className='form-group col-md-11'>
						<label className='dialog-label'>Session</label>
						<TextInput
							id='autoCompleteInput'
							Component='input'
							maxOptions={10}
							matchAny={true}
							placeholder={
								'Ex:- Jagath Wickramarathne / Internet and Web Technologies / Lecture / Y1.S2.IT.02'
							}
							trigger=''
							options={sessions.map(
								(session) => session.asString
							)}
							onChange={onSessionChange}
							value={currentSession}
							style={{
								height: 35,
								width: '100%',
								paddingLeft: 10,
							}}
							onKeyDown={handleKeyDown}
							className={
								isSessionvalid
									? 'form-control'
									: 'form-control is-invalid'
							}
						/>
						{isSessionvalid ? null : (
							<div style={{ color: 'crimson', fontSize: 12 }}>
								{errorMsg}
							</div>
						)}
					</div>
					<div className='form-group col-md-1'>
						<button
							style={{ marginTop: 32, marginRight: 20 }}
							className='temp-add-btn bc-sm-ctrl-btn-upt'
							onClick={addToBucket}
						>
							<IoMdAdd />
						</button>
					</div>
				</div>
				<br />
				{sessionBucket.length ? (
					<div
						style={{
							border: 'solid 1px #dddddd',
							paddingTop: 10,
							paddingLeft: 10,
							overflowY: 'auto',
							marginLeft: 3,
						}}
						className='form-row'
					>
						{sessionBucket.map((session) => {
							return (
								<div
									key={session._id}
									className='d-flex bd-highlight mb-3'
									style={{
										height: 42,
										borderRadius: 50,
										border: 'solid 1px gainsboro',
										marginRight: 5,
									}}
								>
									<div className='mr-auto p-2 bd-highlight'>
										<h6 style={{ display: 'inline' }}>
											{session.asString}
										</h6>
									</div>
									<div className='p-2 bd-highlight'>
										<button
											style={{
												marginLeft: 5,
											}}
											className='sm-ctrl-btn sm-ctrl-btn-dlt'
											onClick={() =>
												removeLabel(session._id)
											}
										>
											<IoMdClose />
										</button>
									</div>
								</div>
							);
						})}
					</div>
				) : null}

				{sessionBucket.length ? (
					<div style={{ marginTop: 15 }} className='form-row'>
						<div className='form-group col-md-12'>
							<span className='float-right'>
								{' '}
								<button
									className='btn btn-primary'
									onClick={addConstraint}
								>
									{isAdding ? (
										<div>
											Adding{' '}
											<FaSpinner className='spin' />
										</div>
									) : (
										'Add'
									)}
								</button>
							</span>
						</div>
					</div>
				) : null}
			</div>
			{sessions.length === 0 ? (
				<EmptyDataPlaceholder message='Constraint list is currently empty' />
			) : (
				<ConstraintConsecutiveSessionsTable
					consecutiveSessionsConstraintsList={
						consecutiveSessionsConstraintsList
					}
					refreshComponent={refreshComponent}
					sessions={sessions}
				/>
			)}
		</div>
	);
}

export default ConstraintsConsecutiveSessions;
