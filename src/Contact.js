import React from 'react';
import Resume from './main2.pdf';

class Contact extends React.Component{

    render() {
        return (
            <a href = {Resume} target = "_blank">Download Pdf</a>
          );
    }
} 

export default Contact;