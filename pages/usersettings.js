import Head from 'next/head';
import Image from 'next/image'
import { useRouter } from 'next/router';

import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/state.js';

import getUser from '../controller/getUser.js';
import {emailValidation} from "../helpers/emailValidation.js"

import Navbar from '../components/Navbar.js';

import { parseCookies, destroyCookie } from 'nookies';

const Settings = (props) => {

    const router = useRouter();

    const { user, storeUser, logout } = useContext(UserContext);

    const [username, setUsername] = useState('Anonymous');
    const [email, setNewEmail] = useState('');
    const [image, setImage] = useState('/tempuser.png');

    useEffect(() => {
        if (props.user.authorization === null) return logout();
        if (props.user.user.username === user.username) return;
        if (props.hasOwnProperty('user')) storeUser(props.user.user);
        else logout();
    }, []);

    useEffect(() => {

        if (!Object.keys(user).length) {
          setUsername('Anonymous');
          setImage('/tempuser.png');
          return;
        }
        
        if (!user.hasOwnProperty('displayName') || !user.hasOwnProperty('photos'))
          return;
    
        if (user.displayName.length > 0) {
          setUsername(user.displayName.split(' ')[0]);
        } else {
          setUsername(user.username);
        }

        if (user.hasOwnProperty('email')){
            emailValidation(user.email) && setNewEmail(user.email)
        }
        
        setImage(user.photos[0].value);
    
    }, [user]);

    const updateInfo = () => {
        
        const authorization = props.user.authorization;
        const oAuthId = props.user.user.oAuthId;

        // set email as "" if user entry invalid value 
        const newEmail =  emailValidation(email) ? email : "";

        if (!authorization)
            return;

        const body = {
            oAuthId,
            displayName: username,
            email:newEmail,
        }

        const fetchURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://giraffeql.io';
        fetch(`${fetchURL}/user`, {method: 'POST', headers: { authorization, 'Content-Type': 'Application/JSON' }, body: JSON.stringify(body)})
            .then(res => res.json())
            .then(data => storeUser(data.user));
    }

    const deleteAccount = () => {
        
        const authorization = props.user.authorization;

        if (!authorization)
            return;

        destroyCookie({}, 'authorization');
        logout();
        router.push('/');

        // const fetchURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://giraffeql.io';
        // fetch(`${fetchURL}/user`, {method: 'DELETE', headers: { authorization }})
        //     .then(() => {
        //         destroyCookie({}, 'authorization');
        //         logout();
        //         router.push('/');
        //     });
    }

    return (
        <div id='settings'>

            <Head>
                <title>giraffeQL</title>
                <link rel="shortcut icon" href="/favicon.png" />
            </Head>

            <Navbar />

            <div id='settingscontainer'>

                <div id='settingsoptions'>
                    <div className='header'>SETTINGS</div>
                    <button className='settingsbtn' ><div style={{marginRight: '8px'}} ><Image className='icon' src='/profile.svg' width={10} height={10} /></div> Account</button>
                    <button className='settingsbtn' ><div style={{marginRight: '8px'}} ><Image className='icon' src='/lock.svg' width={10} height={10} /></div> Security</button>
                    <button className='settingsbtn' ><div style={{marginRight: '8px'}} ><Image className='icon' src='/folder.svg' width={10} height={10} /></div> Projects</button>
                    <hr className='seperator' />
                    <h4>PERMANENT</h4>
                    <button onClick={deleteAccount} className='settingsbtn' style={{color: '#ff6b6b'}} >Delete Account</button>
                </div>

                    <div className='settingsmodal'>
                        <div className='header'>ACCOUNT</div>

                        <div className='content'>

                            <div className='row' >
                                <div className='column'><h1>Profile Photo</h1></div>
                                <div className='column'>
                                    <div style={{display: 'flex', alignItems: 'center'}} >
                                        <div id='imagecontainer'>
                                            <Image 
                                            src={image}
                                            width={36}
                                            height={36}
                                            />
                                        </div>
                                        <button id='uploadbtn' >Upload Photo</button>
                                    </div>
                                </div>
                            </div>

                            <hr/>

                            <div className='row' >
                                <div className='column'><h1>Name</h1></div>
                                <div className='column'><input type='text' val={username} placeholder={username} onChange={(e) => setUsername(e.target.value)} /></div>
                            </div>

                            <div className='row' >
                                <div className='column'><h1>Email Address</h1></div>
                                <div className='column'><input type='text' val={email} placeholder="example@email.com" onChange={(e) => setNewEmail(e.target.value)} /></div>
                            </div>

                            <div className='row' >
                                <div className='column'><div/></div>
                                <div className='column'><button id='updatebtn' onClick={updateInfo} >Update</button></div>
                            </div>
                            <p style={{fontSize: '9px', float: 'right', marginRight: '16px'}}>(at the moment, user information cannot be changed... sorry!)</p>
                        </div>

                    </div>

            </div>

            <style jsx>{`

                *{
                    font-family: 'Inter', sans-serif;
                    transition: all .3s ease;
                }
        
                #settings{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    width: 100vw;
                    height: 100vh;
                    background-color: #edf2f7;
                }

                #settingscontainer{
                    display: flex;
                    align-items: center;
                }

                .settingsmodal{
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
                    border-radius: 8px;
                    width: 650px;
                    height: 300px; 
                    background-color: white;
                    margin-left: 16px;
                }

                #settingsoptions{
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
                    border-radius: 8px;
                    width: 250px;
                    height: 300px; 
                    background-color: white;
                }
        
                .header{
                    width:  100%;
                    min-height: 48px;
                    margin-top: 0;
                    text-align: center;
                    font-size: 16px;
                    font-weight: 700;
                    background-color: #fbfcfd;
                    border-bottom: 2px solid #f0f4f8;
                    color: #46537e;
                    border-radius: 8px 8px 0px 0px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                h1{
                    font-weight: 500;
                    font-size: 16px;
                    color: #48545a;
                    text-align: right;
                    margin-right: 10%;
                }

                h4{
                    color: #b2becc;
                    font-size: 12px;
                    text-align: left;
                    margin-left: 8px;
                    margin-bottom: 0;
                }

                p{
                    color: #b2becc;
                }

                input{
                    width: 200px;
                    height: 24px;
                    outline: none;
                    border: 1px solid #d9ddec;
                    background-color: #f0f4f8;
                    color: #6c7ea3;
                    border-radius: 4px;
                    box-shadow: 0px 0px 4px rgba(0,0,0,.15);
                }

                #updatebtn{
                    color: white;
                    font-weight: 700;
                    background-color: #5661b3;
                    border: none;
                    outline: none;
                    padding: 12px 16px;
                    border-radius: 4px;
                    margin: 8px 0px;

                    &:hover{
                        cursor: pointer;
                        background-color: darken(#5661b3, 10%);
                    }
                }

                #uploadbtn{
                    height: 36px;
                    font-weight: 500;
                    color: #6c7d87;
                    background-color: transparent;
                    outline: none;
                    border: 2px solid #c6cdd1;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                }

                .column{
                    float: left;
                    width: 50%;
                }

                .row{

                    display: flex;
                    align-items: center;

                    &::after {
                        content: "";
                        display: table;
                        clear: both;
                    }
                }

                
                #imagecontainer {
                    width: 36px;
                    height: 36px;
                    margin: 16px;
                    background-color: #c5c5c5;
                    clip-path: circle(18px at center);
                }

                hr{
                    width: 25%;
                    height: 2px;
                    background: #c6cdd1;
                    outline: none;
                    border: none;
                }

                .seperator{
                    width: 100%;
                    border: 0;  
                    height: 1px;
                    background-color: #e1e8f0;
                    margin: 0;
                }          

                .settingsbtn{
                    position: relative;
                    font-size: 16px;
                    text-align: left;
                    background-color: white;
                    padding: 16px;
                    border: none;
                    outline: none;
                    width: 100%;
                    z-index: 9;
                    color: #4a5668;
                    display: flex;
                    justify-content: flex-start;
          
                    &:hover{
                      background-color: #f7fafc;
                      color: #546ad5;
                      cursor: pointer;
                    }
                  }

            `}</style>

        </div>
    );
}

export async function getServerSideProps (ctx) {

    const props = {}
  
    const { authorization } = parseCookies(ctx);
    const { token } = ctx.query
    props.user = await getUser(authorization || token);
    return {props};
}

export default Settings;