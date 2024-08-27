import React, { useState, useCallback } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useCookies } from "react-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet";
import { ButtonGroupButtonContext } from "@mui/material";

const defaultTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#E6F9AF",
    },
  },
});

export default function SignIn() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [cookie, setCookie] = useCookies(["token"]);
  const [verify, setVerify] = useState({ verify: false, email: "" });
  const [clickCount1, setClickCount1] = useState(0);
  const [clickCount2, setClickCount2] = useState(0);
  const [lastResetTime1, setLastResetTime1] = useState(Date.now());
  const [lastResetTime2, setLastResetTime2] = useState(Date.now());

  const handleSubmit = (event) => {
    event.preventDefault();
    const currentTime1 = Date.now();
    const timeElapsed1 = currentTime1 - lastResetTime1;
    if (clickCount1 < 3) {
      setClickCount1((prevCount1) => prevCount1 + 1);
    } else if (timeElapsed1 >= 45000) {
      setClickCount1(1);
      setLastResetTime1(currentTime1);
    } else {
      toast.warning("Too many requests, Plaese wait before submitting again");
      return;
    }
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    // Data validation before sending to the server
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email address");
      return;
    }
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
      );
      return;
    }

    axios
      .post(BASE_URL + "/api/auth/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        toast.success("User logged in successfully");
        setCookie("token", response.data.jwt, { path: "/" });
        setCookie("user", response.data.id, { path: "/" });
        setCookie("username", response.data.username, { path: "/" });
        window.location.href = "/";
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          if (error.response.data.error === "User not verified") {
            setVerify({ verify: true, email: email });
            return;
          }
          toast.error("Invalid credentials");
        } else {
          console.log(error);
          toast.error("An error occurred");
        }
      });
  };

  const handleVerifySubmit = (event) => {
    event.preventDefault();
    const currentTime2 = Date.now();
    const timeElapsed2 = currentTime2 - lastResetTime2;
    if (clickCount2 < 3) {
      setClickCount2((prevCount2) => prevCount2 + 1);
    } else if (timeElapsed2 >= 45000) {
      setClickCount2(1);
      setLastResetTime2(currentTime2);
    } else {
      toast.warning("Too many requests, Plaese wait before submitting again");
      return;
    }
    const data = new FormData(event.currentTarget);
    axios
      .post(BASE_URL + "/api/auth/verify", {
        email: verify.email,
        code: data.get("code"),
      })
      .then((response) => {
        toast.success("Email verified successfully");
        setCookie("token", response.data.jwt, { path: "/" });
        setCookie("user", response.data.id, { path: "/" });
        setCookie("username", response.data.username, { path: "/" });
        window.location.href = "/";
        setVerify(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          toast.error("Invalid verification code");
        } else if (error.response && error.response.status === 403) {
          toast.error("Code expired, A new code has been sent to your email");
        } else {
          console.log(error);
          toast.error("An error occurred");
        }
      });
  };

  return (
    <>
      <Helmet>
        <title>Sign In | devsync</title>
      </Helmet>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="base">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div className="flex items-center justify-center lg:justify-between lg:flex-row flex-col w-full max-w-6xl lg:mt-16">
              <div className="lg:w-1/3 lg:pr-4 lg:mb-0 mb-10 lg:text-left text-center">
                <h1 className="text-5xl font-Roboto text-primary pb-2">
                  devsync
                </h1>
                <p className="text-secondary text-base font-Noto">
                  Collaborate with developers on different projects
                </p>
              </div>
              <div className="flex justify-center text-center flex-col lg:w-2/3 border-zinc-700 lg:pl-12 lg:border-l">
                {verify.verify ? (
                  <>
                    <h2 className="text-3xl font-Roboto">Verify Your Email</h2>
                    <p className="text-secondary font-Noto pt-2">
                      A verification code has been sent to your email address.
                    </p>
                    <Box
                      component="form"
                      onSubmit={handleVerifySubmit}
                      sx={{ mt: 3 }}
                    >
                      <Grid item xs={12} sm={6}>
                        <TextField
                          autoComplete="off"
                          name="code"
                          required
                          fullWidth
                          inputProps={{ maxLength: 8 }}
                          id="code"
                          label="Verification Code"
                          autoFocus
                        />
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{ mt: 3, mb: 2 }}
                        >
                          Verify Email
                        </Button>
                      </Grid>
                    </Box>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl md:text-3xl font-Roboto">
                      Sign In
                    </h2>
                    <Box
                      component="form"
                      onSubmit={handleSubmit}
                      sx={{ mt: 1 }}
                    >
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                      />
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                      />
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                      >
                        Sign In
                      </Button>
                      <div className="flex items-center justify-center">
                        <Link href="/signup" variant="body2">
                          {"Don't have an account? Sign Up"}
                        </Link>
                      </div>
                    </Box>
                  </>
                )}
              </div>
            </div>
          </Box>
        </Container>
      </ThemeProvider>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}
