import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  makeStyles,
  Box,
  Snackbar,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { connect } from "react-redux";
import { loginUser } from "../../actions/auth/authAction";

const Login = (props) => {
  const initialValues = {
    email: "siswa@gmail.com",
    password: "Password`",
  };
  const auth = props.auth;
  const errors = props.errors;
  const token = props.access;
  const history = useHistory();

  const dispatch = useDispatch();
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;

  const handleClick = (newState) => () => {
    setState({ open: true, ...newState });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Required").email("please enter valid email"),
    password: Yup.string()
      .required("Required")
      .min(8, "Password length contain minimal 8 characters"),
  });

  const onSubmit = (values) => {
    const postData = {
      email: values.email,
      password: values.password,
    };
    dispatch(
      loginUser(postData, () => {
        props.setSubmitting(false);
      })
    );
  };

  const classes = useStyles();

  useEffect(() => {
    if (auth.isAuthenticated && auth.data.token) {
      history.push("/");
    }
  }, [auth, token, history]);

  return (
    <Grid className={classes.root}>
      <Paper className={classes.paper}>
        <Formik
          className={classes.form}
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {(props) => (
            <Form className={classes.formContainer}>
              <Grid align="center">
                <Typography
                  style={{
                    fontWeight: "bold",
                    margin: 0,
                  }}
                  variant="h4"
                  gutterBottom
                >
                  Sign In
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  gutterBottom
                >
                  Silahkan masukkan kredensial untuk akses akun anda
                </Typography>
              </Grid>
              <Field
                as={TextField}
                variant="outlined"
                label="Email"
                name="email"
                placeholder="Enter Email"
                fullWidth
                error={props.errors.email && props.touched.email ? true : false}
                required
                className={classes.labelForm}
                helperText={<ErrorMessage name="email" />}
              />
              <Field
                as={TextField}
                label="Password"
                name="password"
                variant="outlined"
                placeholder="Enter password"
                type="password"
                fullWidth
                className={classes.labelForm}
                error={
                  props.errors.password && props.touched.password ? true : false
                }
                required
                helperText={<ErrorMessage name="password" />}
              />
              <Button
                type="submit"
                color="primary"
                variant="contained"
                onClick={handleClick({
                  vertical: "bottom",
                  horizontal: "center",
                })}
                disabled={props.isSubmitting}
                fullWidth
              >
                {props.isSubmitting ? <CircularProgress size={24} /> : "Login"}
              </Button>
              <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                onClose={handleClose}
                key={vertical + horizontal}
                autoHideDuration={5000}
              >
                <Alert
                  onClose={handleClose}
                  severity={props.isValid && errors.isError ? "error" : "info"}
                >
                  {errors.isError ? errors.message : "Checking..."}
                </Alert>
              </Snackbar>
            </Form>
          )}
        </Formik>
      </Paper>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "10px 0",
        }}
      >
        <Typography style={{ marginTop: 15 }} variant="subtitle1" gutterBottom>
          Belum memiliki akun?
          <Link
            to="/register"
            style={{ textDecoration: "none", cursor: "pointer" }}
          >
            {" "}
            Daftar
          </Link>
        </Typography>
      </Box>
    </Grid>
  );
};

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
  formContainer: {
    padding: "30px",
    backgroundColor: "white",
    borderRadius: "8px",
    maxWidth: 460,
    boxShadow: "0px 4px 18px 11px rgba(174, 199, 255, 0.1)",
  },
  form: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    flexDirection: "column",
  },
  labelForm: {
    margin: "10px 0",
  },
  logo: {
    height: "100px",
    width: "100px",
    margin: "20px",
  },
});

Login.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { loginUser })(Login);
