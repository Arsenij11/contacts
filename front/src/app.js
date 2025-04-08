import React from "react";
import Header from "./components/header";
import Footer from "./components/footer";
import Info from "./components/info";

class App extends React.Component {
    render () {
        return (
            <>
                <Header />
                <Info />
                <Footer />
            </>
        )
    }
}

export default App;