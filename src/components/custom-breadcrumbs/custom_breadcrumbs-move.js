import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { ListItem } from '@mui/material';
//
import LinkItem from './link-item';

// ----------------------------------------------------------------------

export default function CustomBreadcrumbs({
  notLink = false,
  links,
  action,
  heading,
  moreLink,
  activeLast,
  onClick,
  sx,
  ...other
}) {
  const lastLink = links[links.length - 1].name;

  return (
    <Box sx={{ ...sx }}>
      <Stack direction="row" alignItems="center">
        <Box sx={{ flexGrow: 1 }}>
          {/* HEADING */}
          {heading && (
            <Typography variant="h4" gutterBottom>
              {heading}
            </Typography>
          )}

          {/* BREADCRUMBS */}
          {!!links.length && (
            <Breadcrumbs separator={<Separator />} {...other}>
              {links.map((link) => (
                <>
                  {notLink ? (
                    <ListItem
                      sx={{
                        typography: 'body2',
                        alignItems: 'center',
                        color: 'text.primary',
                        display: 'inline-flex',
                        cursor: 'pointer',
                        ...(link.name === lastLink &&
                          !activeLast && {
                            cursor: 'default',
                            pointerEvents: 'none',
                            color: 'text.disabled',
                          }),
                          padding: 0
                      }}
                      onClick={() => onClick(link.href)}
                    >
                      {link.name}
                    </ListItem>
                  ) : (
                    <LinkItem
                      key={link.name || ''}
                      link={link}
                      activeLast={activeLast}
                      disabled={link.name === lastLink}
                    />
                  )}
                </>
              ))}
            </Breadcrumbs>
          )}
        </Box>

        {action && <Box sx={{ flexShrink: 0 }}> {action} </Box>}
      </Stack>

      {/* MORE LINK */}
      {!!moreLink && (
        <Box sx={{ mt: 2 }}>
          {moreLink.map((href) => (
            <Link
              key={href}
              href={href}
              variant="body2"
              target="_blank"
              rel="noopener"
              sx={{ display: 'table' }}
            >
              {href}
            </Link>
          ))}
        </Box>
      )}
    </Box>
  );
}

CustomBreadcrumbs.propTypes = {
  sx: PropTypes.object,
  action: PropTypes.node,
  links: PropTypes.array,
  heading: PropTypes.string,
  moreLink: PropTypes.array,
  activeLast: PropTypes.bool,
  notLink: PropTypes.bool,
  onClick: PropTypes.func,
};

// ----------------------------------------------------------------------

function Separator() {
  return (
    <Box
      component="span"
      sx={{
        width: 4,
        height: 4,
        borderRadius: '50%',
        bgcolor: 'text.disabled',
      }}
    />
  );
}
