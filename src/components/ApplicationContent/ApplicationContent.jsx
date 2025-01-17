import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { useState } from 'react';

//components
import Statistics from '../../containers/Statistics/Statistics';
import Locations from '../../containers/Locations/Locations';
import Lecturers from '../../containers/Lecturers/Lecturers';
import Subjects from '../../containers/Subjects/Subjects';
import WorkingTime from '../../containers/WorkingTime/WorkingTime';

import './applicationContent.css';
import Tags from '../../containers/Tags/Tags';
import StudentGroups from '../../containers/StudentGroups/StudentGroups';
import Constraints from '../../containers/Constraints/Constraints';
import Session from '../../containers/Sessions/Sessions';
import GenerateTimeTable from '../../containers/GenerateTimeTable/GenerateTimeTable'


const ApplicationContent = (props) => {
    const [showSubMenu, setShowSubMenu] = useState(false);

    return (
        <div
            className={
                showSubMenu
                    ? 'ac-main-container-with-side-menu'
                    : 'ac-main-container-without-side-menu'
            }
        >
            <Switch>
                <Route
                    path="/locations"
                    component={() => (
                        <Locations setShowSubMenu={setShowSubMenu} />
                    )}
                />
                <Route
                    path="/statistics"
                    component={() => (
                        <Statistics setShowSubMenu={setShowSubMenu} />
                    )}
                />
                <Route
                    path="/tags"
                    component={() => <Tags setShowSubMenu={setShowSubMenu} />}
                />
                <Route
                    path="/student-groups"
                    component={() => (
                        <StudentGroups setShowSubMenu={setShowSubMenu} />
                    )}
                />
                <Route
                    path="/constraints"
                    component={() => (
                        <Constraints setShowSubMenu={setShowSubMenu} />
                    )}
                />
                <Route
                    path="/lecturers"
                    component={() => (
                        <Lecturers setShowSubMenu={setShowSubMenu} />
                    )}
                />
                <Route
                    path="/subjects"
                    component={() => (
                        <Subjects setShowSubMenu={setShowSubMenu} />
                    )}
                />
                <Route
                    path="/working-time"
                    component={() => (
                        <WorkingTime setShowSubMenu={setShowSubMenu} />
                    )}
                />
                <Route
                    path="/timetables"
                    component={() => (
                        <GenerateTimeTable setShowSubMenu={setShowSubMenu} />
                    )}
                />
                <Route
                    path="/sessions"
                    component={() => (
                        <Session setShowSubMenu={setShowSubMenu} />
                    )}
                />
                <Route
                    path="/"
                    component={() => (
                        <WorkingTime setShowSubMenu={setShowSubMenu} />
                    )}
                />
            </Switch>
        </div>
    );
};

export default ApplicationContent;
