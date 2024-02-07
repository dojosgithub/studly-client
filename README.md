## NODE.JS

- Node 16.x || 18.x

## USING YARN (Recommend)

- yarn install
- yarn start

## USING NPM

- npm i OR npm i --legacy-peer-deps
- npm start

//TO ADD DIFFERENT COMPONENETS IN DASHBOARD

- First make that component in the dashboard folder which is inside the pages folder like

src>pages>dashboard>YOUR DESIRE COMPONENT>ITS NECESSARY FILES

- Then in the layouts folder go to dashboard folder and then inside dashboard in the config-navigation.js file add those components accordingly.

//TO CHANGE FROM DASHBOARD TO MAINLAYOUT

-First comment the {PATH_AFTER_LOGIN} route
-Also comment the Dashboard Route
-Uncomment the MainLayout route
-Also wrap it under the AuthGuard
