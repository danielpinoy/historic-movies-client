import React, { useState } from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { editUser } from "../../../asyncThunk/userAsyncThunks";
import { Alert } from "react-bootstrap";

const ProfileEditView = ({ clickUpdate, token }) => {
    const dispatch = useDispatch();
    // eslint-disable-next-line no-unused-vars
    const { user, loading, error } = useSelector((state) => state.user);

    const [updatedUserData, setUpdatedUserData] = useState(user);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUserData({ ...updatedUserData, [name]: value });
    };

    const handleSubmit = () => {
        dispatch(editUser({ userData: user, updatedUserData, token }));
        clickUpdate(null);
    };

    return (
        <>
            <Card>
                <Card.Body>
                    <Card.Title>Edit Profile</Card.Title>
                    <ListGroup className="list-group-flush">
                        <ListGroup.Item>
                            Username:
                            <input
                                type="text"
                                name="Username"
                                value={updatedUserData.Username}
                                onChange={handleChange}
                            />
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Password:
                            <input
                                type="text"
                                name="Password"
                                value={updatedUserData.Password}
                                onChange={handleChange}
                            />
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Date of Birth:
                            <input
                                type="date"
                                name="Birthday"
                                value={updatedUserData.Birthday}
                                onChange={handleChange}
                            />
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Email:
                            <input
                                type="email"
                                name="Email"
                                value={updatedUserData.Email}
                                onChange={handleChange}
                            />
                        </ListGroup.Item>
                    </ListGroup>
                </Card.Body>
            </Card>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button onClick={handleSubmit}>Update</Button>
        </>
    );
};

export default ProfileEditView;
