import * as React from "react";
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await axios
      .post(BASE_URL + "/api/auth/login", {
        email: data.get("email"),
        password: data.get("password"),
      })
      .then((response) => {
        toast.success("User logged in successfully");
        setCookie("token", response.data.jwt, { path: "/" });
        setCookie("user", response.data.username, { path: "/" });
        window.location.href = "/";
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          toast.error("Invalid credentials");
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
                <h1 className="text-5xl font-Roboto text-primary pb-2">
                  devsync
                </h1>
                <p className="text-secondary font-Noto">
                  Collaborate with developers on different projects
                </p>
              </div>
              <div className="flex justify-center text-center flex-col lg:w-2/3 border-zinc-700 lg:pl-12 lg:border-l">
                <h2 className="text-3xl font-Roboto">Sign In</h2>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
                  <div className="flex items-center justify-between">
                    <Link href="/forgotpassword" variant="body2">
                      Forgot password?
                    </Link>
                    <Link href="/signup" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </div>
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
