import React from 'react';
import { AppBar, Toolbar, Typography, Box, Link, Divider, Button } from '@mui/material';
import { styled } from '@mui/system';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import CopyrightIcon from '@mui/icons-material/Copyright';
import User1 from 'assets/images/users/user-round.svg';
import PlaceholderImage from 'assets/images/landingPage/placeholderImage.svg';
import MoneyFlux from 'assets/images/landingPage/moneyFlux.svg';
import IndexAnalysis from 'assets/images/landingPage/index.svg';
import SwingAnalysis from 'assets/images/landingPage/swing.svg';
import ProSetup from 'assets/images/landingPage/proSetup.svg';
import product from 'assets/images/landingPage/product.svg';
// import { Link } from 'react-router-dom';
import './index.css';

const content = {
  1: {
    title: 'MONEY FLUX',
    icon: MoneyFlux,
    description:
      'See how big players are building positions in index. Best tool to have for option buying in markets. With money flux you will get candle by candle position update of all market participants.'
  },
  2: {
    title: 'Index Analysis',
    icon: IndexAnalysis,
    description:
      'Now see whether major players are building bullish or bearish positions in the market and analyse with the custom time range selector. If you are planning to buy a breakout but not sure whether that breakout will sustain or not, then index analyzer is for you.'
  },
  3: {
    title: 'Swing Centre',
    icon: SwingAnalysis,
    description:
      'It provides the best stocks available to add in your swing baskets, & gives clear idea about current money flow across the different market segment. Stocks which are breaking important support and resistance with momentum will be filtered here'
  },
  4: {
    title: 'Pro Setups',
    icon: ProSetup,
    description:
      'Here active day traders will find most suitable trade setups as per their style of trading. Pro setup gives variety of trades starts from highest reversal trade opportunities, momentum trading, loss of momentum trading , multiple support/ resistance breakout and much more pro setups to trade in intraday'
  }
};

const RootContainer = styled('div')({
  backgroundColor: '#121212',
  color: '#ffffff',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column'
});

const NavbarLink = styled(Link)(({ theme }) => ({
  color: '#ffffff',
  marginLeft: '1.5rem',
  textDecoration: 'none',
  fontFamily: 'Figtree',
  '&:hover': {
    color: '#d3d3d3'
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0,
    marginTop: '0.5rem',
    display: 'block',
    textAlign: 'center'
  }
}));

const ContentContainer = styled(Box)({
  width: '90%',
  margin: '20px auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  marginTop: '10rem'
});

const RowContainer = styled(Box)({
  display: 'flex',
  width: '100%',
  gap: '10px',
  minHeight: '400px',
  marginBottom: '40px'
});

const SmallBox = styled(Box)({
  flexBasis: '30%',
  color: '#ffffff',
  padding: '20px',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '200px'
});

const SmallBoxContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  // letterSpacing:'10px',
  gap: '10px'//gap b/w the lines vertically
});

const LargeBox = styled(Box)({
  flexBasis: '70%',
  backdropFilter: 'blur(200px)',
  background: '#FFFFFF0A',
  padding: '20px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '400px',
  backgroundImage: `url(${PlaceholderImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center'
});

const Heading = styled(Typography)({
  fontSize: '1.25rem',
  textTransform: 'uppercase',
  fontFamily: 'Figtree'
});

const Description = styled(Typography)({
  fontSize: '0.875rem',
  color: '#d3d3d3',
  fontFamily: 'Figtree'
});

const TestimonialsContainer = styled(Box)({
  width: '90%',
  margin: '40px auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
});

const TestimonialHeading = styled(Typography)({
  fontSize: '2.6rem',
  fontWeight: '500',
  marginBottom: '20px',
  fontFamily: 'Playfair Display',
  color: '#373E46'
});

const SampleReview = styled(Typography)({
  textAlign: 'center',
  maxWidth: '600px',
  marginBottom: '20px',
  color: '#443E4E',
  fontStyle: 'italic',
  fontFamily: 'Figtree'
});

const TestimonialFooter = styled(Box)({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center'
});

const ReviewerName = styled(Typography)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  color: '#000000',
  fontSize: '0.9rem',
  fontFamily: 'Figtree'
});

const Footer = styled(Box)({
  backgroundColor: '#1f1f1f',
  color: '#ffffff',
  padding: '20px 0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  marginTop: 'auto'
});

const FooterColumn = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  flexGrow: 1,
  textAlign: 'center'
});

const TextContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px 0' // Adjust padding as needed
});

const Line1 = styled(Typography)({
  fontSize: '2.2rem',
  fontWeight: '600',
  fontFamily: 'Playfair Display',
  textAlign: 'center'
});

const Line2 = styled(Typography)({
  fontSize: '0.9rem',
  color: '#d3d3d3',
  textAlign: 'center',
  fontFamily: 'Figtree'
});

const FlexColumnContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%' // Ensure it takes the full width
});

const FullWidthImage = styled('div')({
  width: '100%',
  height: '300px', // Adjust the height as needed
  backgroundImage: `url(${product})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  marginTop: '40px' // Adjust the spacing from the content as needed
});

const FooterContainer = ({ children }) => (
  <Box
    sx={{
      backgroundColor: '#FFFFFF',
      borderRadius: '16px 16px 0 0',
      overflow: 'hidden' // Optional, prevents content from overflowing rounded corners
    }}
  >
    {children}
  </Box>
);

const SamplePage = () => (
  <RootContainer>
    <div className="landing-page-navbar">
      <AppBar position="fixed" className="navbar-border" sx={{ backgroundColor: '#141516', boxShadow: 'none' }}>
        <Toolbar sx={{ flexDirection: { xs: 'column', sm: 'row' }, px: '1rem' }}>
          <Typography
            variant="h6"
            component="div"
            className="navbar-product-name"
            sx={{ flexGrow: { sm: 1 }, textAlign: { xs: 'center', sm: 'left' }, color: '#ffffff' }}
          >
            <span className="custom-product-name">INVESTO</span>
          </Typography>
          <Box sx={{ display: { xs: 'flex', sm: 'block' }, flexDirection: 'column', alignItems: 'center' }}>
            <NavbarLink href="#features" variant="body2">
              FEATURES
            </NavbarLink>
            <NavbarLink href="#testimonials" variant="body2">
              TESTIMONIALS
            </NavbarLink>
            <NavbarLink href="#about" variant="body2">
              ABOUT US
            </NavbarLink>
          </Box>
        </Toolbar>
      </AppBar>
    </div>

    <ContentContainer>
      {[...Array(5)].map((_, index) => (
        <RowContainer key={index}>
          {index % 2 === 0 ? (
            <FlexColumnContainer>
              {' '}
              {/* New wrapper for column layout */}
              <Box display="flex" sx={{ width:'100%', alignContent:'center', marginLeft:'20px'  }}>
                <SmallBox>
                  {index === 0 ? (
                    <SmallBoxContent>
                      <Typography sx={{ fontSize: '3.4rem', fontWeight: '600', fontFamily: 'Playfair Display', letterSpacing:'2px' }}>
                        See Beyond,
                        <br />
                        Stand Apart
                      </Typography>
                      <Typography sx={{ fontSize: '0.9rem', color: '#d3d3d3', fontFamily: 'Figtree', marginRight:'80px', textAlign:'left', marginLeft:'30px' }}>
                        Your edge in the market starts with superior analysis.
                      </Typography>
                      <Box sx={{ position: 'relative', width:'13rem' }}>
                        <Button variant="contained"
                          onClick={() => { window.location.href = 'http://localhost:3000/myapp/pages/login/login3'; }}                          
                          sx={{        
                            position:'absolute',
                            left:'0',   
                            fontFamily: 'Figtree',
                            width:'13rem',
                            height:'3.2rem',
                            backgroundColor: '#231E13',
                            border: 'none',
                            borderWidth: '2px',
                            borderStyle: 'solid',
                            borderImage: 'linear-gradient(93.4deg, #FFC42B 0%, #FFD567 50%, #FFC42B 100%)',
                            borderImageSlice: 1,
                            color: '#FFC42B',
                            mt: '10px',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 196, 43, 0.1)',
                              borderImage: 'linear-gradient(93.4deg, #FFC42B 100%, #FFD567 100%, #FFC42B 100%)'
                            }
                          }}
                        >
                          Get Started
                        </Button>
                      </Box>
                    </SmallBoxContent>
                  ) : (
                    <SmallBoxContent>
                      <Box className="feature-preview">
                        <img src={content[index].icon} className="feature-icon" />
                        <Heading>{content[index].title}</Heading>
                        <Description>{content[index].description}</Description>
                      </Box>
                    </SmallBoxContent>
                  )}
                </SmallBox>
                <LargeBox />
              </Box>
              {index === 0 && ( // Product info container should be below the boxes
                <div className="product-info-container">
                  <TextContainer>
                    <Line1>The Ultimate Research Companion</Line1>
                    <Line2>Fast, intuitive, and comprehensive - get the insights you need to act with confidence.</Line2>
                  </TextContainer>
                </div>
              )}
            </FlexColumnContainer>
          ) : (
            <FlexColumnContainer>
              <Box display="flex" width="100%">
                <LargeBox />
                <SmallBox>
                  <SmallBoxContent>
                    <Box className="feature-preview">
                      <img src={content[index].icon} className="feature-icon" />
                      <Heading>{content[index].title}</Heading>
                      <Description>{content[index].description}</Description>
                    </Box>
                  </SmallBoxContent>
                </SmallBox>
              </Box>
              {index === 0 && (
                <div className="product-info-container">
                  <TextContainer>
                    <Line1>The Ultimate Research Companion</Line1>
                    <Line2>Fast, intuitive, and comprehensive - get the insights you need to act with confidence.</Line2>
                  </TextContainer>
                </div>
              )}
            </FlexColumnContainer>
          )}
        </RowContainer>
      ))}

      {/* Add the new lines here */}
    </ContentContainer>

    {/* Testimonials and Footer sections remain unchanged */}
    <FooterContainer>
      <TestimonialsContainer>
        <TestimonialHeading>What traders are saying about us</TestimonialHeading>
        <SampleReview>
          As avid index options trader, I need to find exactly where the flow is today. Investo has taken away all the manual work I used to
          do and on top of that there advanced algos are working great in find next big movement on that day.
        </SampleReview>
        <Divider sx={{ width: '80%', mb: '20px' }} />
        <TestimonialFooter sx={{ width: '80%', mb: '20px' }}>
          <ReviewerName>
            <img src={User1} alt="Reviewer Avatar" style={{ width: '40px', borderRadius: '50%' }} />
            John Doe
          </ReviewerName>
          <Box
            sx={{
              display: 'flex',
              gap: '10px'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '0.86px solid #DBDBDB'
              }}
            >
              <ArrowBackIcon sx={{ color: '#606872' }} />
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '0.86px solid #DBDBDB'
              }}
            >
              <ArrowForwardIcon sx={{ color: '#606872' }} />
            </Box>
          </Box>
        </TestimonialFooter>
      </TestimonialsContainer>
      <FullWidthImage />
      <Footer
        sx={{
          backgroundColor: '#EBEFF4',
          borderTop: '2px solid #DCE3EB',
          color: '#606872',
          padding: '10px 0' // optional padding for better layout
        }}
      >
        <FooterColumn sx={{ justifyContent: 'flex-start', flexDirection: 'row', marginLeft: '20px' }}>
          <CopyrightIcon fontSize="small" sx={{ color: '#606872' }} />
          <Typography variant="body2" sx={{ marginLeft: '10px', color: '#606872', fontFamily: 'Figtree' }}>
            Invest in Mind
          </Typography>
        </FooterColumn>
        <FooterColumn sx={{ justifyContent: 'center' }}>
          <Typography variant="body2" sx={{ color: '#606872', fontFamily: 'Figtree' }}>
            help@investinmind.com | +91 - 9999999999
          </Typography>
        </FooterColumn>
        <FooterColumn sx={{ flexDirection: 'row', gap: '10px', justifyContent: 'flex-end', marginRight: '20px' }}>
          <FacebookIcon sx={{ color: '#606872' }} />
          <LinkedInIcon sx={{ color: '#606872' }} />
          <InstagramIcon sx={{ color: '#606872' }} />
        </FooterColumn>
      </Footer>
    </FooterContainer>
  </RootContainer>
);

export default SamplePage;
