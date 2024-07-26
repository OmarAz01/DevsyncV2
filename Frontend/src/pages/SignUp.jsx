import * as React from "react";
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
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // Form Validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;
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
        toast.success("User registered successfully");
        setCookie("token", response.data.jwt, { path: "/" });
        window.location.href = "/";
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
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="base">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 12,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div className="flex items-center justify-center lg:justify-between lg:flex-row flex-col w-full max-w-6xl lg:mt-16">
              <div className="lg:w-1/3 lg:pr-4 lg:mb-0 mb-16 lg:text-left text-center">
                <h1 className="text-5xl font-Roboto  text-primary pb-2">
                  devsync
                </h1>
                <p className="text-secondary font-Noto">
                  Collaborate with developers on different projects
                </p>
              </div>
              <div className="flex justify-center text-center flex-col lg:w-2/3 border-zinc-700 lg:pl-12 lg:border-l">
                <h2 className="text-3xl font-Roboto">Sign Up</h2>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        autoComplete="given-name"
                        name="firstName"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        autoFocus
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
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
