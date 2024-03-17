import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../../asyncThunk/userAsyncThunks";
import { Alert } from "react-bootstrap";

export const SignupView = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [birthday, setBirthday] = useState("");
    const dispatch = useDispatch();
    const signUpSubmit = (event) => {
        event.preventDefault();
        console.log(password);
        console.log(email);

        dispatch(
            signupUser({ Username: username, Password: password, Email: email, Birthday: birthday })
        );
        setUsername("");
        setPassword("");
        setEmail("");
        setBirthday("");
        navigate("/login");
    };
    return (
        <Form onSubmit={signUpSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Username:</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="ExampleName123"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength="3"
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Email:</Form.Label>

                <Form.Control
                    type="email"
                    placeholder="ExampleName123@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Birthday:</Form.Label>
                <Form.Control
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    required
                />
            </Form.Group>
            <Button type="submit">Submit</Button>
        </Form>
    );
};
