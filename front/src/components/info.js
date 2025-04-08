import React from "react";
import loading from "./icons/1.png";
import axios from "axios";
import change from "./img/изменить_изображение.png"

class Info extends React.Component {
    id = null;
    ava = null;
    constructor(props) {
        super(props);
        this.state = {
            name : null,
            data : null,
            error : null,
            profile_picture : null,
            jobTitle : null,
            department : null,
            company : null,
            success : null,
            not_success : null,
            endwith_user : 0,
            end : null
        }
    }


    componentDidMount() {
        axios.get(
            'http://127.0.0.1:8000/api/employees/1'
        ).
        then((response) => {
            const data = response.data;
            if (data?.detail) {
                this.setState({error : data.detail})
            }
            else if (response.status === 404) {
                this.setState({error : "По Вашему запросу ничего не найдено"})
            }
            else {
                console.log(data);
                this.setState({data : data, endwith_user : 100})
            }
        })
    }

    checkdata(event) {
        event.preventDefault();

        const formdata = new FormData();


        console.log(event.target.ava.files[0]);
   
        formdata.append('name' , event.target.name.value.length > 0 ? event.target.name.value : event.target.name.placeholder);

        if (this.ava) {
            formdata.append('profile_picture' , event.target.ava.files[0]);
        }

        formdata.append('jobTitle' , event.target.jobTitle.value.length > 0 ? event.target.jobTitle.value : event.target.jobTitle.placeholder);
        formdata.append('department', event.target.department.value.length > 0 ? event.target.department.value : event.target.department.placeholder);
        formdata.append('company' , event.target.company.value.length > 0 ? event.target.company.value : event.target.company.placeholder);


        console.log(formdata);

        fetch(`http://127.0.0.1:8000/api/change_info/${this.id}`,
            {
                method : 'PUT',
                body : formdata,
             
            }
        ).
        then((response) => {return response.json()}).
        then((json) => {
            const data = json;
         
            if (data.detail) {
                this.setState({error : data.detail})
            }
            else if (data.status === 404) {
                this.setState({error : "По Вашему запросу ничего не найдено"})
            }
            else {
                const user = document.getElementById(`user_${this.id}`);
                user.textContent = `🗿 ${data.name}`;
                this.setState({
                    success : true,
                    not_success : null
                })

            }
        })
    }

    render() {
        const {data, error, name, profile_picture, jobTitle, department, company, success, not_success, endwith_user, end} = this.state;
        
   
        if (error) {
            return (
                <main>
                    <h1>Произошла ошибка {error}<br />Попробуйте обновить страницу</h1>
                </main>
            )
        }
        
        if (!data) {
            return (
                <main>
                    <img className="loading" src = {loading} alt = "загрузка..." />
                </main>
            )
        }
       
        const users = [];

        for (let d of data) {
            const last_id = d.id;
            users.push(<span className="user" key={d.id} id = {`user_${d.id}`}
                             onClick = {
                                        (event) => {    
                                                        const spans = document.querySelectorAll('.user');
                                                        spans.forEach((span) => {
                                                            if (span.style.backgroundColor === 'grey') {
                                                                span.style.backgroundColor = 'white';
                                                            }
                                                        })
                                                        event.target.style.backgroundColor = 'grey';
                                                        

                                                        const form = document.querySelector('form');
                                                        
                                                        if (form) {
                                                            form.querySelectorAll('input').forEach((f) => {if (['name', 'company', 'department', 'jobTitle'].filter((el) => {return el === f.getAttribute('name')}).length > 0) {f.value = null}});;
                                                        }

                                                        axios(
                                                            {
                                                                method : 'get',
                                                                url : `http://127.0.0.1:8000/api/change_info/${d.id}`,
                                                            }
                                                        ).
                                                        then((response) => {
                                                            const data = response.data;
                                                            if (data?.detail) {
                                                                this.setState({error : data.detail})
                                                            }
                                                            else if (response.status === 404) {
                                                                this.setState({error : "По Вашему запросу ничего не найдено"})
                                                            }
                                                            else {
                                                                console.log(data);
                                                                this.id = d.id;
                                                                this.ava = null;
                                                                this.setState({
                                                                    profile_picture : data.profile_picture,
                                                                    jobTitle : data.jobTitle,
                                                                    department : data.department,
                                                                    company : data.company,
                                                                    name : data.name,
                                                                    success : null,
                                                                    not_success : null
                                                                })
                                                            }
                                                        })

                                                    }
                                        }>🗿 {d.name}
                        </span>)
            if (data[data.length - 1] === d && end){
                users.push(<span className="last" key={last_id + 1} 
                    onClick={(event) => {
                    axios.get(
                        `http://127.0.0.1:8000/api/employees/${endwith_user - 200}`
                    ).
                    then((response) => {
                        const data = response.data;
                        if (data?.detail) {
                            this.setState({error : data.detail})
                        }
                        else if (response.status === 404) {
                            this.setState({error : "По Вашему запросу ничего не найдено"})
                        }
                        else {
                            console.log(data);
                            this.setState({data : data, endwith_user : endwith_user - 100, end : null})
                        }
                    })
                    event.target.scrollTop = 5;
                }}>Вернуться назад</span>)
            }
        }
        return (
        <main>
            <div id="list_of_users" onScroll={(event) => {
                console.log(event.target.scrollTop, endwith_user);
                if(event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight && !end) {
                    axios.get(
                        `http://127.0.0.1:8000/api/employees/${endwith_user}`
                    ).
                    then((response) => {
                        const data = response.data;
                        if (data?.detail === 'Больше пользователей не существует') {
                            this.setState({end : true})
                        }
                        else if (data?.detail) {
                            this.setState({error : data.detail})
                        }
                        else if (response.status === 404) {
                            this.setState({error : "По Вашему запросу ничего не найдено"})
                        }
                        else {
                            console.log(data);
                            this.setState({data : data, endwith_user : endwith_user + 100})
                        }
                    })
                    event.target.scrollTop = 5;
                }
                else if (event.target.scrollTop === 0 && endwith_user > 100) {
                    axios.get(
                        `http://127.0.0.1:8000/api/employees/${endwith_user - 200}`
                    ).
                    then((response) => {
                        const data = response.data;
                        if (data?.detail) {
                            this.setState({error : data.detail})
                        }
                        else if (response.status === 404) {
                            this.setState({error : "По Вашему запросу ничего не найдено"})
                        }
                        else {
                            console.log(data);
                            this.setState({data : data, endwith_user : endwith_user - 100, end : null})
                        }
                    })
                    event.target.scrollTop = 5;
                }
            }}
           
            >
                {users}
            </div>
            <div id="user_info">
                {name && profile_picture && jobTitle && department && company ?
                    <form onSubmit={this.checkdata.bind(this)} encType="multipart/form-data" method="PUT">
                                                    {success ? <div className="success">&#9989; Данные были успешно изменены!</div> : not_success ? 
                                                               <div className="not_success">&#10060; Введены некорректные данные!</div> : <span></span>}
                                                    <div id="username">
                                                        <input type="text" name="name" placeholder={name} 
                                                        
                                                        onFocus={
                                                            (event) => {
                                                                event.target.style.border = "1px solid #47afe9";
                                                                event.target.style.outline = "none";
                                                                event.target.parentElement.style.backgroundColor = "#c7edfc";
                                                            }}
                                
                                                        onBlur={(event) => {
                                                                event.target.style.border = "1px solid black";
                                                                event.target.parentElement.style.backgroundColor = "white";
                                                            }}
                                                
                                                        />
                                                    </div>
                                                    <span className="avatarka">
                                                        <input type = "file" name="ava" 
                                                            style = {{
                                                                backgroundImage : this.ava ? `url(${this.ava})` : `url(${profile_picture})`,
                                                            }} 
                                                            onMouseOver={(event) => {
                                                                event.target.style.backgroundImage = `url(${change})`; 
                                                                event.target.style.cursor = 'pointer';
                                                            }}
                                                            onMouseOut={(event) => {
                                                                console.log(this.ava);
                                                                console.log(this.ava);
                                                                event.target.style.backgroundImage = this.ava ? `url(${this.ava})` : `url(${profile_picture})`; 
                                                                event.target.style.cursor = 'none';
                                                            }}
                                                            onChange={(event) => {
                                                             
                                                                for (let file of event.target.files) {
                                                                    const reader = new FileReader();
                                                                    reader.onload = () => {
                                                                        this.ava = reader.result;
                                                                    }
                                                                    reader.readAsDataURL(file);
                                                                }
                                                            }}
                                                            accept="image/*"
                                                        />
                                                        <span className="note">
                                                            <label htmlFor="jobTitle">Должность</label>
                                                            <input type="text" name = "jobTitle" placeholder={jobTitle} />
                                                            <label htmlFor="department">Отдел</label>
                                                            <input type="text" name = "department" placeholder={department} />
                                                            <label htmlFor="company">Компания</label>
                                                            <input type="text" name = "company" placeholder={company} />
                                                        </span>
                                                    </span>
                                
                                                    <button type="submit">Сохранить</button>
                                                </form>
                 : 
                    <div id="no_user">Выберите пользователя</div>
                }
            </div>
        </main>
        )
    }
}

export default Info;