import React, { useState } from "react";
import { TextField, Button, Box, InputAdornment, IconButton } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Icon } from "@iconify/react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useAppDispatch } from "../../redux/hooks";
import { setLogInFlag } from "../../redux/features/actions/auth";
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const LogInForm = ({ onLoginSuccess, onLoginError }) => {
    const dispatch = useAppDispatch();
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email address").required("Required"),
            password: Yup.string().required("Required"),
        }),
        onSubmit: async (values) => {
            try {
                const auth = getAuth();
                await signInWithEmailAndPassword(auth, values.email, values.password);
                toast.success("Logged in successfully");
                dispatch(setLogInFlag(false));
                onLoginSuccess();
            } catch (error) {
                toast.error("Failed to log in");
                onLoginError(error);
            }
        },
    });

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={formik.handleSubmit}
        >
            <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                id="email"
                name="email"
                label="Email Address"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
                fullWidth
                variant="outlined"
                margin="normal"
                id="password"
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                                <Icon icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"} />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <Box mt={3}>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    type="submit"
                    style={{ backgroundColor: 'var(--trendflow-pink)' }}
                >
                    Log In
                </Button>
            </Box>
        </motion.form>
    );
};

export default LogInForm;