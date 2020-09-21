import React from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { IoMdClose, IoMdCreate } from 'react-icons/io';
import swal from '@sweetalert/with-react';
import DeleteConfirmationDialogBox from '../DeleteConfirmationDialogBox/DeleteConfirmationDialogBox';
// import UpdateSubGroupIDsDialogBox from './UpdateConstraintsLecturersDialogBox';
import { store } from 'react-notifications-component';
import { buildToast } from '../../util/toast';
import EmptyDataPlaceholder from '../EmptyDataPlacehoder/EmptyDataPlaceholder';

function ConstraintsUnOverlapSessionsTable(props) {

    const onDeleteClick = (itemId) => {
		swal({
			buttons: false,
			content: (
				<DeleteConfirmationDialogBox
					deleteEventWithIdHandler={deleteConstraint}
					itemId={itemId}
				/>
			),
		});
    };
    
    const deleteConstraint = (itemId) => {
		axios
			.delete(`http://localhost:8000/api/v1/constraintsunoverlapsessions/${itemId}`)
			.then((res) => {
				swal.close();
				props.refreshComponent();
				store.addNotification(
                    buildToast(
                        'danger',
                        'Deleted',
                        'Constraint Deleted Successfully'
                    )
                );
			})
			.catch((err) => {
				console.log(err.response);
			});
    };

    
    const columns = [
		{ name: 'ID', selector: '_id', omit: true },
		{ name: 'Year', selector: 'year', sortable: true },
		{ name: 'Semester', selector: 'semester', sortable: true },
        { name: 'Session 1', selector: 'unoverlapsessions[0].asString', sortable: true, grow: 5, cell: row => <div>{row.unoverlapsessions[0].asString}</div> },
		{ name: 'Session 2', selector: 'unoverlapsessions[1].asString', sortable: true, grow: 5, cell: row => <div>{row.unoverlapsessions[1].asString}</div> },   
        {
			name: 'Action',
			cell: (row) => (
				<div>
					<button
						style={{marginRight:30, marginTop:7}}
						className='sm-ctrl-btn sm-ctrl-btn-dlt bc-sm-ctrl-btn-dlt'
						onClick={() => {
							onDeleteClick(row._id);
						}}
					>
						<IoMdClose />
					</button>
				</div>
			),
			button: true,
		},
    ];

    return (
		<DataTable
			title="UnOverlap Sessions"
			data={props.unoverlapSessionsConstraintsList}
			columns={columns}
			noDataComponent = {<EmptyDataPlaceholder message={'No Data Found'} />}
			pagination
			highlightOnHover
		/>
    )
}

export default ConstraintsUnOverlapSessionsTable
