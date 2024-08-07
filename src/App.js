import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Main from './Main';
import Experience from './Experience';
import Nav from './Navigation';
import Projects from './Projects';
import { Circles } from 'react-loader-spinner';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bgColor: null,
            hoverColor: null,
            className: null,
            error: null
        };
    }

    convertTimeToUnix(timeInString) {
        // console.log(timeInString)
        var vals = timeInString.split(' ');
        // console.log("vals" ,vals , new Date().getMonth()+1)
        var date = vals[0].split("/")
        // console.log("Date inside", date)
        var time = vals[1].split(":")
        if (vals[2] === 'PM') {
            time[0] = String(parseInt(time[0]) + 12);
        }
        // console.log("Date now" , date, time)
        var unixTimeStamp = new Date(Number(date[0]), Number(date[1])-1, Number(date[2]), Number(time[0]), Number(time[1]), Number(time[2]))
        // console.log(unixTimeStamp - new Date().getTime())
        // console.log("Full year", unixTimeStamp.getFullYear())
        // console.log("Unix timestamp", new Date(unixTimeStamp.getTime()))
        // console.log("Year", new Date(unixTimeStamp).getFullYear())
        return unixTimeStamp.getTime()
    }

    componentDidMount() {
        // console.log("geolocation" , 'geolocation' in navigator)
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                let obj = `lat=${position.coords.latitude}&lng=${position.coords.longitude}`
                // console.log(obj)
                let response = await fetch("https://api.sunrisesunset.io/json?" + obj);
                // console.log("https://api.sunrisesunset.io/json?" + obj)
                let resp_obj = await response.json();
                let result = resp_obj.results
                const date = new Date()
                // console.log("Date YMD", date.getFullYear)
                const ymd = date.getFullYear() + '/' + String(Number(date.getMonth())+1) + '/' + date.getDate()
                // console.log("ymd value", ymd)
                const sunrise = ymd + " " + result.sunrise
                const sunset = ymd + " " + result.sunset
                // console.log(result.sunrise, result.sunset)
                var unixsunrise = this.convertTimeToUnix(sunrise);
                var unixsunset = this.convertTimeToUnix(sunset);
                // console.log(new Date(unixsunrise * 1000), new Date(unixsunset * 1000));
                // console.log(result.sunrise, result.sunset )
                // console.log(result)
                // console.log(sunrise, sunset)
                // const unixsunrise = new Date(sunrise).getTime()
                // const unixsunset = new Date(sunset).getTime()
                // console.log(compareSunrise, unixsunrise, compareSunset, unixsunset);
                // console.log(unixsunset - unixsunrise , new Date().getTime() - unixsunrise, unixsunset - new Date().getTime())
                // console.log(new Date().getTime() >= unixsunrise && new Date().getTime() <= unixsunset)
                // console.log(unixsunrise, unixsunset)
                // console.log(new Date().getTime() >= unixsunrise,new Date().getTime() <= unixsunset)
                // console.log("Geolocation allowed!")
                // console.log(unixsunset - new Date().getTime(), unixsunrise - new Date().getTime());

                if(new Date().getTime() >= unixsunrise && new Date().getTime() <= unixsunset) {
                    this.setState({
                        bgColor: "#A8DF8E",
                        hoverColor: "#A8DF8E",
                        className: "nav-item-theme-light"
                    });
                } else {
                    this.setState({
                        bgColor: "#183D3D",
                        hoverColor: "#fff",
                        className: "nav-item-theme-dark"
                    });
                }


            }, (error) => {
                console.log("Error retrieving geolocation, proceeding with default")
                // console.log(new Date().getHours());
                if((new Date().getHours() >= 18 && new Date().getHours() <= 23) || ( new Date().getHours>= 0 && new Date().getHours() <= 6)) {
                    this.setState({
                        bgColor: "#183D3D",
                        hoverColor: "#fff",
                        className: "nav-item-theme-dark"
                    });
                } else {
                    this.setState({
                        bgColor: "#A8DF8E",
                        hoverColor: "#A8DF8E",
                        className: "nav-item-theme-light"
                    });
                }
                this.setState({ error: error.message });
            });

        } else {
            console.log("Error retrieving geolocation, proceeding with default")
            if((new Date().getHours() >= 18 && new Date().getHours() <= 23) || ( new Date().getHours>= 0 && new Date().getHours() <= 6)) {
                this.setState({
                    bgColor: "#183D3D",
                    hoverColor: "#fff",
                    className: "nav-item-theme-dark"
                });
            } else {
                this.setState({
                    bgColor: "#A8DF8E",
                    hoverColor: "#A8DF8E",
                    className: "nav-item-theme-light"
                });
            }
            this.setState({error: "Browser doesn't support geolocation, switching back to the default."});
        }
    }

    render() {
        if (!this.state.bgColor || !this.state.className || !this.state.hoverColor) {
            return (
                <div style={{position: 'absolute', left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%)'}}>
                 <Circles 
                    height="80"
                    width="80"
                    color="#4fa94d"
                    ariaLabel="circles-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                />
                </div>
                
            )
        }
        const { bgColor, hoverColor, className } = this.state;
        return (
            <div>
                <HashRouter>
                    <div>
                    <Nav bgColor={bgColor} hoverColor={hoverColor} className={className} />
                    <Routes>
                    <Route path="/" element={<Main bgColor={bgColor}/>} />
                    <Route path="/Experience" element={<Experience bgColor={bgColor} />} />
                    <Route path="/Projects" element={<Projects bgColor={bgColor} />} />
                    </Routes>
                    </div>
                </HashRouter>
            </div>
        )
    }
}

export default App;