import React, {useState} from "react";
import {Container, Box, Typography, TextField, Button, Paper, Alert, AlertColor} from "@mui/material";
import {registerNewUser} from "./register.telefunc";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [severity, setSeverity] = useState<AlertColor>("info");

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const result = await registerNewUser({username, email, password});
            if (result?.success) {
                setSeverity("success");
                setMessage("Registration successful! Redirecting...");
                window.location.href = "/auth/login";
            } else {
                setSeverity("error");
                setMessage("Registration failed.");
            }
        } catch (err) {
            setSeverity("error");
            setMessage("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center", color: "white"}}>
                <Paper elevation={3} sx={{p: 4, width: '100%'}}>
                    <Typography component="h1" variant="h5" align="center">
                        Register
                    </Typography>

                    <Box component="form" onSubmit={onSubmit} sx={{mt: 3}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{mt: 3, mb: 2, color: "white"}}
                        >
                            {loading ? "Registering..." : "Register"}
                        </Button>

                        {message && <Alert severity={severity}>{message}</Alert>}
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
