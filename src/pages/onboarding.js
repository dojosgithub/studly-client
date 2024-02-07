import { Helmet } from 'react-helmet-async';
// sections
import { OnboardingView } from 'src/sections/onboarding/view';

// ----------------------------------------------------------------------

export default function OnboardingPage() {
  return (
    <>
      <Helmet>
        <title> Onboarding </title>
      </Helmet>

      <OnboardingView />
    </>
  );
}
