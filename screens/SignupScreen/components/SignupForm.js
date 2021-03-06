import React, { useState, useRef, useEffect } from "react";
import { Field, reduxForm } from "redux-form";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";

//Colors
import Colors from "../../../utils/Colors";
import CustomText from "../../../components/UI/CustomText";
//Redux
import { useDispatch, useSelector } from "react-redux";
//Action
import * as AuthActions from "../../../store/auth/authActions";
//PropTypes check
import PropTypes from "prop-types";
import renderField from "./RenderField";

//Validation
const validate = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = "Email không được bỏ trống";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Email không hơp lệ";
  }
  if (!values.password) {
    errors.password = "Mật khẩu không được bỏ trống";
  } else if (values.password.length < 6) {
    errors.password = "Mật khẩu phải nhiều hơn hoặc bằng 6 ký tự";
  }
  if (!values.confirmpassword) {
    errors.confirmpassword = "Mật khẩu không được bỏ trống";
  } else if (values.confirmpassword !== values.password) {
    errors.confirmpassword = "Mật khẩu xác nhận không trùng khớp";
  }
  if (!values.username) {
    errors.username = "Tên không được bỏ trống";
  } else if (values.username.length > 20) {
    errors.username = "Tên không vượt quá 20 ký tự";
  }

  return errors;
};

const Signup = (props) => {
  const { handleSubmit, reset } = props;
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.isLoading);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setshowConfirmPass] = useState(false);
  const unmounted = useRef(false);
  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  const submit = async (values) => {
    try {
      await dispatch(
        AuthActions.SignUp(values.username, values.email, values.password)
      );
      reset();
      if (!unmounted.current) {
        Alert.alert("Signup Successfully", "You can login now", [
          {
            text: "Okay",
            onPress: () => {
              props.navigation.goBack();
            },
          },
        ]);
      }
    } catch (err) {
      alert(err);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "position" : null}
      // keyboardVerticalOffset={40} // adjust the value here if you need more padding
      // style={{ flex: 1 }}
    >
      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              flexDirection: "column",
              marginHorizontal: 10,
              zIndex: 0,
            }}
          >
            <View>
              <CustomText style={styles.title}>REGISTER</CustomText>
            </View>
            <View>
              <Field
                name='username'
                keyboardType='default'
                label='Your Name'
                component={renderField}
                icon='id-card'
                autoCapitalize={true}
              />
              <Field
                name='email'
                keyboardType='email-address'
                label='Email'
                icon='email'
                component={renderField}
              />
              <Field
                name='password'
                keyboardType='default'
                label='Password'
                component={renderField}
                secureTextEntry={showPass ? false : true}
                passIcon='pass'
                icon='lock'
                showPass={showPass}
                setShowPass={setShowPass}
              />
              <Field
                name='confirmpassword'
                keyboardType='default'
                label='Confirm Password'
                component={renderField}
                secureTextEntry={showConfirmPass ? false : true}
                passIcon='confirm'
                icon='lock'
                showConfirmPass={showConfirmPass}
                setshowConfirmPass={setshowConfirmPass}
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmit(submit)}
              style={{ marginVertical: 10, alignItems: "center" }}
            >
              <View style={styles.signIn}>
                {loading ? (
                  <ActivityIndicator
                    style={{ paddingTop: 10 }}
                    size='small'
                    color='#fff'
                  />
                ) : (
                  <CustomText style={styles.textSign}>REGISTER</CustomText>
                )}
              </View>
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

Signup.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
};
const styles = StyleSheet.create({
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    flexDirection: "row",
    backgroundColor: Colors.lighter_green,
    marginTop: 20,
  },
  title: {
    color: Colors.light_green,
    fontSize: 40,
    fontWeight: "bold",
    letterSpacing: 5,
    textAlign: "center",
  },
  textSign: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "600",
  },
  textSignSmall: {
    color: Colors.lighter_green,
    textAlign: "center",
  },
});
const SignupForm = reduxForm({
  form: "signup", // a unique identifier for this form
  validate, // <--- validation function given to redux-form
})(Signup);

export default SignupForm;
