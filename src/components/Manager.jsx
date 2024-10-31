import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faCopy,
  faTrashCan,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

import { ToastContainer, toast, Bounce } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import "react-toastify/dist/ReactToastify.css";

const Manager = () => {
  const [seePwd, setSeePwd] = useState(false);
  const [form, setForm] = useState({
    id: "",
    site: "",
    username: "",
    password: "",
  });
  const [pwdArray, setPwdArray] = useState([]);
  const pwdInputRef = useRef();
  const formRef = useRef();

  const getPasswords = async ()=> {
    let req = await fetch('http://localhost:3000')
    let passwords = await req.json()
    setPwdArray(passwords);

  }

  useEffect(() => {
     getPasswords()
    
  }, []);

  const showPassword = () => {
    setSeePwd((seePwd) => !seePwd);
    pwdInputRef.current.type === "text"
      ? (pwdInputRef.current.type = "password")
      : (pwdInputRef.current.type = "text");
  };

  const savePassword = async () => {
    if (form.site === "" || form.username === "" || form.password === "") {
      return;
    }

    const exist = pwdArray.findIndex((item) => item.id === form.id);
    if (exist !== "undefined" && exist !== -1) {
      const updatedArray = pwdArray.map((item, index) =>
        index === exist ? form : item
      );
      setPwdArray(updatedArray);
      await fetch(`http://localhost:3000/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {

      const newEntry = { ...form, id: uuidv4() }
      setPwdArray([...pwdArray, newEntry]);
      
      await fetch('http://localhost:3000', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry)
      })
    }

    setForm({ id: "", site: "", username: "", password: "" });
    formRef.current.focus();
    toast.success("Password Saved!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
  };

  const editPassword = (id) => {
    setForm(pwdArray.filter((item) => item.id === id)[0]);
    formRef.current.focus();
  };

  const deletePassword = async (id) => {
    setPwdArray(pwdArray.filter((item) => item.id !== id));

    let res = await fetch('http://localhost:3000', {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({id})
    })
    toast.error("Password Deleted!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.info("Copied to Clipboard!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      savePassword();
    }
  };

  return (
    <>
      <div className="mx-auto mb-16 py-8 pb-16 md:py-16 flex flex-col gap-8 md:px-24 lg:px-36 xl:px-52 2xl:px-64">
        <div className="md:bg-gray-700 flex flex-col p-6 gap-7 rounded-md">
          <div className="flex flex-col text-center mb-6">
            <div className="text-white text-3xl">
              &lt;Pass<span className="text-green-500 font-bold">Wiz</span>{" "}
              /&gt;
            </div>
            <p className="text-sm text-white font-thin">
              Your own Password Manager
            </p>
          </div>
          <div className="">
            <input
              onKeyDown={handleKeyPress}
              value={form.site}
              onChange={handleChange}
              name="site"
              className=" bg-green-200 w-full px-4 py-1 rounded-md outline-none neon-input"
              type="text"
              placeholder="Website URL"
              autoFocus
              ref={formRef}
            />
          </div>
          <div className=" flex flex-col md:flex-row gap-7">
            <input
              onKeyDown={handleKeyPress}
              value={form.username}
              onChange={handleChange}
              name="username"
              className=" bg-green-200 w-full px-4 py-1 rounded-md outline-none neon-input"
              type="text"
              placeholder="Username"
            />
            <div className="w-full flex rounded-md pwdInput-container bg-green-200">
              <input
                onKeyDown={handleKeyPress}
                value={form.password}
                onChange={handleChange}
                name="password"
                className=" bg-green-200 w-full px-4 py-1 rounded-tl-md rounded-bl-md outline-none"
                type="password"
                placeholder="Password"
                ref={pwdInputRef}
              />
              <div
                onClick={showPassword}
                className="bg-green-200 rounded-tr-md rounded-br-md flex items-center justify-center px-2 cursor-pointer ml-[-1px]"
              >
                <FontAwesomeIcon icon={!seePwd ? faEyeSlash : faEye} />
              </div>
            </div>
          </div>
          <button
            onClick={savePassword}
            className="bg-green-600 flex items-center gap-1 rounded-full self-center px-3 py-1 hover:bg-green-400 active:bg-green-400 saveBtn outline-none"
          >
            <lord-icon
              src="https://cdn.lordicon.com/jgnvfzqg.json"
              trigger="hover"
            ></lord-icon>
            <span className="font-semibold text-[#121331]">Save</span>
          </button>
        </div>

        <div className="bg-green-100 rounded-md px-2 md:px-6 py-4 flex flex-col gap-6">
          <div className="font-bold text-xl ">Your Passwords</div>
          {pwdArray.length === 0 ? (
            <div className="text-sm text-gray-800">No Passwords to Show</div>
          ) : (
            <div className="mb-4">
              <table className="table-fixed w-full rounded-t-md overflow-hidden">
                <thead className="bg-green-800 text-white">
                  <tr className="text-left">
                    <th className="md:w-[40%] p-2 font-semibold">Site</th>
                    <th className="p-2 font-semibold">Username</th>
                    <th className="p-2 font-semibold">Password</th>
                    <th className="w-20 p-2 font-semibold text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {pwdArray.map((item, index) => {
                    return (
                      <tr key={item.id} className="border-b border-black">
                        <td className="p-2 whitespace-nowrap text-ellipsis overflow-hidden border-r border-black">
                          <a href={item.site} target="_blank">
                            {item.site}
                          </a>
                        </td>
                        <td className="p-2 border-r border-black">
                          <div className="flex justify-between items-center gap-2">
                            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                              {item.username}
                            </span>
                            <button
                              onClick={() => {
                                copyText(item.username);
                              }}
                              className="cursor-pointer"
                            >
                              <FontAwesomeIcon icon={faCopy} />
                            </button>
                          </div>
                        </td>
                        <td className="p-2 border-r border-black">
                          <div className="flex justify-between items-center gap-2">
                            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                              {"•".repeat(item.password.length)}
                            </span>
                            <button
                              onClick={() => {
                                copyText(item.password);
                              }}
                              className="cursor-pointer"
                            >
                              <FontAwesomeIcon icon={faCopy} />
                            </button>
                          </div>
                        </td>
                        <td className="p-2 flex items-center gap-4 justify-center">
                          <button
                            onClick={() => {
                              editPassword(item.id);
                            }}
                            className="cursor-pointer"
                          >
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              style={{ color: "#003f85" }}
                            />
                          </button>
                          <button
                            onClick={() => {
                              const yes = confirm(
                                "Do you really want to delete this password?"
                              );
                              yes && deletePassword(item.id);
                            }}
                            className="cursor-pointer"
                          >
                            <FontAwesomeIcon
                              icon={faTrashCan}
                              style={{ color: "#d70707" }}
                            />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition="Bounce"
      />
    </>
  );
};

export default Manager;
