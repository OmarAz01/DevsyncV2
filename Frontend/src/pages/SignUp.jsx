import React, { useState, useCallback } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useCookies } from "react-cookie";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Helmet } from "react-helmet";
import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";

const defaultTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#E6F9AF",
    },
  },
});

export default function SignUp() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [cookie, setCookie, removeCookie] = useCookies(["token"]);
  const [verify, setVerify] = useState({ verify: false, email: "" });
  const [email, setEmail] = useState("");
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
    // Form Validation
    const profanityMatcher = new RegExpMatcher({
      ...englishDataset.build(),
      ...englishRecommendedTransformers,
    });
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (profanityMatcher.hasMatch(data.get("username"))) {
      toast.error("Username contains profanity");
      return;
    }
    if (profanityMatcher.hasMatch(data.get("firstName"))) {
      toast.error("First name contains profanity");
      return;
    }
    if (profanityMatcher.hasMatch(data.get("lastName"))) {
      toast.error("Last name contains profanity");
      return;
    }
    if (profanityMatcher.hasMatch(data.get("email"))) {
      toast.error("Email contains profanity");
      return;
    }
    if (
      data.get("username").toLowerCase() === "admin" ||
      data.get("username").toLowerCase() === "administrator" ||
      data.get("username").toLowerCase() === "myprofile"
    ) {
      toast.error("Username is not allowed");
      return;
    }

    if (!passwordRegex.test(data.get("password"))) {
      toast.error(
        "Password must contain an uppercase letter, a symbol, and a number"
      );
      return;
    }
    if (data.get("password") !== data.get("confirm-password")) {
      toast.error("Passwords do not match");
      return;
    }
    if (!emailRegex.test(data.get("email"))) {
      toast.error("Invalid email address");
      return;
    }
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(data.get("username"))) {
      toast.error("Username should not contain any symbols");
      return;
    }

    const user = {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      username: data.get("username"),
      email: data.get("email"),
      password: data.get("password"),
    };
    axios
      .post(BASE_URL + "/api/auth/register", user)
      .then((response) => {
        setVerify({ verify: true, email: user.email });
        // toast.success("User registered successfully");
        // setCookie("token", response.data.jwt, { path: "/" });
        // setCookie("user", response.data.id, { path: "/" });
        // setCookie("username", response.data.username, { path: "/" });
        // window.location.href = "/profile/myprofile";
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.error);
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
    const verification = {
      email: email,
      code: data.get("code"),
    };
    axios
      .post(BASE_URL + "/api/auth/verify", verification)
      .then((response) => {
        toast.success("User verified successfully");
        setCookie("token", response.data.jwt, { path: "/" });
        setCookie("user", response.data.id, { path: "/" });
        setCookie("username", response.data.username, { path: "/" });
        window.location.href = "/profile/myprofile";
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.error);
        } else {
          console.log(error);
          toast.error("An error occurred");
        }
      });
  };

  return (
    <>
      <Helmet>
        <title>Sign Up | devsync</title>
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
                <h1 className="text-5xl font-Roboto  text-primary pb-2">
                  devsync
                </h1>
                <p className="text-secondary font-Noto">
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
                      Sign Up
                    </h2>
                    <Box
                      component="form"
                      onSubmit={handleSubmit}
                      sx={{ mt: 3 }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            autoComplete="given-name"
                            name="firstName"
                            required
                            fullWidth
                            inputProps={{ maxLength: 30 }}
                            id="firstName"
                            label="First Name"
                            autoFocus
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            required
                            fullWidth
                            inputProps={{ maxLength: 30 }}
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            autoComplete="family-name"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            required
                            fullWidth
                            inputProps={{ maxLength: 10 }}
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="off"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            required
                            fullWidth
                            id="email"
                            inputProps={{ maxLength: 254 }}
                            label="Email Address"
                            type="email"
                            name="email"
                            autoComplete="email"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            required
                            fullWidth
                            name="confirm-password"
                            label="Retype Password"
                            type="password"
                            id="confirm-password"
                            autoComplete="new-password"
                          />
                        </Grid>
                      </Grid>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                      >
                        Sign Up
                      </Button>
                      <Grid container justifyContent="center">
                        <Grid item>
                          <Link href="/signin" variant="body2">
                            Already have an account? Sign in
                          </Link>
                        </Grid>
                      </Grid>
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
