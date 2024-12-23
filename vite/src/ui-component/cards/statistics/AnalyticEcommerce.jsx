import PropTypes from 'prop-types';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import MainCard from 'ui-component/MainCard';


// Function to format numbers in the Indian numbering system
const formatNumberToIndian = (num) => {
  // Ensure the input is a number
  const number = Number(num);
  if (isNaN(number)) return num; // Return the original value if not a valid number
  return number.toLocaleString('en-IN');
};


export default function AnalyticEcommerce({ title, count, change, percentage }) {
  const percentageColor = percentage < 0 ? '#FF5966' : '#00EFC8'; // Red for loss, green for gain

  return (
    <MainCard
      contentSX={{
        p: 3.25,
        backgroundColor: '#1e1e1e', // Dark background
        color: 'white', // White text color
      }}
    >
      <Grid container justifyContent="space-between" alignItems="center">
        {/* Left side: Title */}
        <Grid item>
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Figtree',
              color: '#FFFFFF',
              opacity: 0.8,
              fontWeight: '400',
              fontSize: '20px',
            }}
          >
            {title}
          </Typography>
        </Grid>

        {/* Right side: Count and Percentage */}
        <Grid item>
          <Stack direction="column" alignItems="flex-end">
            {/* Count */}
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'Figtree',
                color: '#FFFFFF',
                opacity: 0.8,
                fontWeight: '300',
                fontSize: '24px',
              }}
            >
              {/* {count} */}
              {formatNumberToIndian(count)}
            </Typography>

            {/* Change and Percentage */}
            {(change !== undefined || percentage !== undefined) && (
              <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                {/* Change */}
                {change !== undefined && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: percentageColor,
                      fontFamily: 'Figtree',
                      fontWeight: '500',
                      fontSize: '14px',
                    }}
                  >
                    {`${change}`}
                  </Typography>
                )}

                {/* Percentage */}
                {percentage !== undefined && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: percentageColor,
                      fontFamily: 'Figtree',
                      fontWeight: '500',
                      fontSize: '14px',
                    }}
                  >
                    {`(${percentage}%)`}
                  </Typography>
                )}
              </Box>
            )}
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
}

AnalyticEcommerce.propTypes = {
  title: PropTypes.string,
  count: PropTypes.number,
  change: PropTypes.number,
  percentage: PropTypes.number,
};
