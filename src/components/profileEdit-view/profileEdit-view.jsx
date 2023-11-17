import React, { useState } from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { editUser } from "../../actions/userActions";
import { Alert } from "react-bootstrap";

export const ProfileEditView = ({ clickUpdate, token }) => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.user);

    const [updatedUserData, setUpdatedUserData] = useState(user);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUserData({ ...updatedUserData, [name]: value });
    };

    const handleSubmit = () => {
        console.log(user, loading);
        dispatch(editUser(user, updatedUserData, token));
        clickUpdate(null);
    };

    return (
        <>
            loading ?<div>LOADING</div>:
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
