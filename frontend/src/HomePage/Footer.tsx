import { MDBCol, MDBContainer, MDBFooter, MDBRow } from 'mdb-react-ui-kit';
import '../css/footer.css';

//TODO: add content

function Footer() {
    return (
        <MDBFooter className='bg-secondary text-white text-center text-md-start'>
      <MDBContainer className='p-4'>
        <MDBRow>
          <MDBCol lg="6" md="12" className='mb-4 mb-md-0'>
            <h5 className='text-uppercase'>About Us</h5>

            <p>
            At Clinic-O , we are dedicated to providing compassionate,
            personalized healthcare to our community, ensuring each patient receives exceptional care and support on their journey to better health.
            </p>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        © 2024 Clinic-O: 
        <a className='text-white' href='/'>
           Clinic-O.com
        </a>
      </div>
    </MDBFooter>
    ); 
    
}

export default Footer