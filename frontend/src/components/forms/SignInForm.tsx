/*
 * Copyright 2022 tandemdude
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useFormik } from "formik";
import { useState } from "react";
import { SubmitButtonInteractible, SubmitButtonLoading } from "./SubmitButton";
import axios from "axios";
import { saveCredentials } from "../../utils/credentials";

export default function SignInForm({setShowSignUp, setSignedIn, setContext}) {
    const [loading, setLoading] = useState(false);
    const [incorrectCredentials, setIncorrectCredentials] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            remember: false,
        },
        onSubmit: values => {
            setLoading(true);
            axios.post("http://localhost:8081/client/sign-in", values)
                 .then(response => {
                     if (response.status == 200) {
                         let store = values.remember ? "persistent" : "session";
                         let accessToken = response.data.access_token;
                         let refreshToken = response.data.refresh_token;

                         let expiresIn = parseInt(response.data.expires_in);
                         let expiresAt = Math.floor(Date.now() / 1000) + expiresIn;
                         setSignedIn(true);

                         let context = {accessToken, refreshToken, expiresAt, store};
                         setContext(context);

                         saveCredentials(context);
                     }
                 })
                 .catch(error => {
                     if (error.response && error.response.status == 401) {
                         setLoading(false);
                         setIncorrectCredentials(true);
                     } else {
                         alert("An unknown error occurred: " + error.message);
                     }
                 });
        },
    });

    return (
        <form className="sign-in-form space-y-6 relative" onSubmit={formik.handleSubmit}>
            <h5 className="text-xl font-medium text-white">Sign in to Notcord</h5>
            <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">Email</label>
                <input id="email" name="email" type="email" onChange={formik.handleChange}
                       value={formik.values.email} placeholder="name@notcord.io" required={true}
                       className="border text-sm rounded-lg block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white outline-none"/>
            </div>
            <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-300">Password</label>
                <input id="password" name="password" type="password" onChange={formik.handleChange}
                       value={formik.values.password} placeholder="••••••••" required={true}
                       className="border text-sm rounded-lg block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white outline-none"/>
                {incorrectCredentials ?
                    <p id="incorrect-credentials-alert" className="text-rose-400 text-xs">Password is incorrect,
                        or an account with the given email does not exist</p> : null}
            </div>
            <div className="flex items-start">
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input id="remember" type="checkbox" className="w-4 h-4 rounded bg-gray-700"
                               onChange={formik.handleChange} checked={formik.values.remember}/>
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="remember" className="text-gray-300">Remember me</label>
                    </div>
                </div>
                <a href="#" className="ml-auto text-sm hover:underline text-indigo-500">Lost Password?</a>
            </div>
            {loading ? <SubmitButtonLoading/> : <SubmitButtonInteractible content={"Sign In"}/>}
            <div className="text-sm font-medium text-gray-300">
                Not registered? <a onClick={() => setShowSignUp({showSelf: true, showBanner: false})}
                                   className="hover:underline text-indigo-500 cursor-pointer">Create account</a>
            </div>
        </form>
    );
}
