"use client";

import {useEffect, useState} from 'react';
import styles from './page.module.css';
import Head from "next/head";
import {useRouter} from "next/navigation";

export default function LoginSignupForm() {
    const [isActive, setIsActive] = useState(false);
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    function handleSubmit(){
        console.log(username)
        console.log(password)
        if (username === "anjana" && password === "anjana"){
            sessionStorage.setItem('user', 'anjana')
            router.push('/')
        }
        else{
            alert('Incorrect username or password')
            return
        }
    }


    return (
        <div className={styles.mainContainer}>
            <Head>
                <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'/>
            </Head>
            <div className={`${styles.container} ${isActive ? styles.active : ''}`}>
            <div className={`${styles.formBox} ${styles.login}`}>
                <form autoComplete={"off"} action={handleSubmit}>
                    <h1>Login</h1>
                    <div className={styles.inputBox}>
                        <input type="text" placeholder="Username" required onChange={(e) => setUsername(() => e.target.value)}/>
                        <i className='bx bxs-user'></i>
                    </div>
                    <div className={styles.inputBox}>
                        <input type="password" placeholder="Password" required onChange={(e) => setPassword(() => e.target.value)} />
                        <i className='bx bxs-lock-alt'></i>
                    </div>

                    <button type="submit" className={styles.btn}>Login</button>
                </form>
            </div>



            <div className={`${styles.formBox} ${styles.register}`}>
                <form>
                    <h1>Registration</h1>
                    <div className={styles.inputBox}>
                        <input type="text" placeholder="Username" required autoComplete={"off"} />
                        <i className='bx bxs-user'></i>
                    </div>
                    <div className={styles.inputBox}>
                        <input type="email" placeholder="Email" required />
                        <i className='bx bxs-envelope'></i>
                    </div>
                    <div className={styles.inputBox}>
                        <input type="password" placeholder="Password" required />
                        <i className='bx bxs-lock-alt'></i>
                    </div>
                    <button type="submit" className={styles.btn}>Register</button>

                </form>
            </div>

            {/* Toggle Panels */}
            <div className={styles.toggleBox}>
                <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
                    <h1>Hello, Welcome!</h1>
                    <p>Don't have an account?</p>
                    <button className={`${styles.btn} ${styles.registerBtn}`} onClick={() => setIsActive(true)}>
                        Register
                    </button>
                </div>

                <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
                    <h1>Welcome Back!</h1>
                    <p>Already have an account?</p>
                    <button className={`${styles.btn} ${styles.loginBtn}`} onClick={() => setIsActive(false)}>
                        Login
                    </button>
                </div>
            </div>
        </div>
        </div>

    );
}
