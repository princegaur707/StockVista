import PropTypes from 'prop-types';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import MainCard from 'ui-component/MainCard';

export default function AnalyticEcommerce({ title, count, percentage, isLoss }) {
  const percentageColor = percentage < 0 ? '#FF5966' : '#00EFC8';
  return (
    <MainCard
      contentSX={{
        p: 2.25,
        backgroundColor: '#1e1e1e', // Dark background similar to the image
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
              {count}
            </Typography>

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
                {`${percentage}%`}
              </Typography>
            )}
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
}

AnalyticEcommerce.propTypes = {
  title: PropTypes.string,
  count: PropTypes.string,
  percentage: PropTypes.number,
  isLoss: PropTypes.bool,
};
