# Repository structure

This repository contains all the different Typescript apps that are part of the project. The apps are:
- `api`: A serverless Firebase API that provides the interface between the frontend or game server and the game database (Firestore).
- `client`: A Preact frontend app that provides the user interface for the game.
- `server`: A Node.js server that provides the game server for the game.
- `matchmaker`: A Node.js server that provides the matchmaker for the game.
- `shared`: Shared code between the different apps.

## Local development

Regardless of the method you use below, the apps will be available at the following URLs:
- Client: http://localhost:8080
- Firebase emulators: http://localhost:4000 (useful to modify data in the database for testing)

### Using Docker

Run `docker-compose up --build` at the root of the repository to launch all the apps locally.
Running `npm install` in `client`, `server` and `matchmaker` might still be necessary for your IDE to resolve the dependencies correctly.

### Bare-metal

Alternatively run each service separately bare-metal:
```
    cd client && npm run start
    cd server && npm run start 
    cd matchmaker && npm run start
    cd api/functions && npm run emulators:start
```

## Deployment

### CI/CD Pipeline (Recommended)

The project uses GitHub Actions for automated deployment. See `.github/CI_CD_SUMMARY.md` for a complete overview.

**Quick Start:**
1. Push to `main` branch
2. GitHub Actions automatically detects changed services
3. Runs tests and deploys only what changed
4. Monitor progress in the Actions tab

**Setup:** See `.github/SETUP.md` for detailed instructions.

**Features:**
- ✅ Automated testing before deployment
- ✅ Smart path-based deployment (only deploys changed services)
- ✅ Preview environments for PRs
- ✅ Manual deployment option

### Manual Deployment (Legacy)

Alternatively, use the bash scripts:
- API deployment: `bash deploy_api.sh`
- Client deployment: `bash deploy_client.sh`
- Server deployment: `bash deploy_server.sh`
- Matchmaker deployment: `bash deploy_matchmaker.sh`

**Note:** The API has its own `firebase.json` file used for local development with the Firebase emulators. The `firebase.json` at the root of the repository is the one used for deployment to prod.

### Setting up secrets

For Firebase Functions:  `firebase functions:secrets:set SECRET_NAME`, you'll then be prompted to enter the secret value. It can then be accessed in the code with `process.env.SECRET_NAME`. 

To access it in Firebase Functions, don't forget to add `{ secrets: ["<secret_name>"] }` to the function declaration.

To access it in one of the Cloud Run services, go to the Google Cloud Console, select the project, then click on the service and edit to create a new revision. In the secrets tab you can add a secret referring to the one set in Firebase.

# Electron

To build the Electron app, run `npm run electron:build`. This will create a `release` folder with the app.

To run the Electron app, run `npm run electron:dev`. This will start the app in development mode.

To test the Electron app, run `npm run electron:test`. This will create a `release` folder with the app and run it.

## Steam

The Steam build is done by running `npm run electron:build:<platform>`.

Test with `open release/mac-arm64/Legion.app` or `release/mac-arm64/Legion.app/Contents/MacOS/Legion` in a terminal.

### Steam Deployment

Partner ID: 325618

**Production App**
- App id: 3729580
- macOS Depot: 3729581  
- Windows Depot: 3729582

**Playtest App**  
- App id: 3870830
- macOS Depot: 3870831
- Windows Depot: 3870832

#### Deployment Commands

Deploy to production:
```bash
./deploy_steam.sh production
```

Deploy to playtest:
```bash
./deploy_steam.sh playtest
```

The script will automatically:
1. Generate the appropriate VDF file from template
2. Upload to Steam using steamcmd
3. Clean up temporary files

#### Manual Setup (one-time)

For both apps, make sure to:
- Create depots per OS in Steam Partner portal
- List all depots in the store package
- Configure launch options  
- Verify packages include the correct depots

**Production App Links:**
- Depots: https://partner.steamgames.com/apps/depots/3729580
- Builds: https://partner.steamgames.com/apps/builds/3729580
- Store Package: https://partner.steamgames.com/store/packagelanding/1312865  
- Launch Options: https://partner.steamgames.com/apps/config/3729580
- Packages: https://partner.steamgames.com/pub/packageadmin/325618

**Playtest App Links:**
- Depots: https://partner.steamgames.com/apps/depots/3870830
- Builds: https://partner.steamgames.com/apps/builds/3870830
- Store Package: https://partner.steamgames.com/store/packagelanding/1312865  
- Launch Options: https://partner.steamgames.com/apps/config/3870830
- All Packages: https://partner.steamgames.com/pub/packageadmin/325618
- Manage Playtest: https://partner.steamgames.com/apps/playtest/3870830

### Steps

- Make a change
- `npm run electron:build`
- `bash deploy_steam.sh playtest`
- On the Build page, set new build as default; no need to hit "Publish"
- `bash deploy_steam.sh production`

### Checklist

Please ensure that you have:
- at least one depot set to [All Languages]
- that you have uploaded the build to that depot
- that you have added the depot containing your app's files to both the Developer Comp and Free packages AND to the red ones as well
- that you have set that build live on the "default" branch
- and that you have correctly configured your launch options

### Troubleshooting

A download size of 0 Mb is probably a sign that the build is not being uploaded to the depot.

If error about "Platform Support Matches", go to Steamworks admin (https://partner.steamgames.com/apps/view/3996730) and tick the right boxes in "Supported Operating Systems".

Try manual upload at: https://partner.steamgames.com/apps/depotuploads/3870830


Successfully added child app to publisher 325618
Added app payment reporting to publisher 325618
Created package "Legion Demo Developer Comp" with ID 1402723
Created package "Legion Demo for Beta Testing" with ID 1402724
Created package "Legion Demo" with ID 1402725
Successfully added autogrant package 1402723 to publisher 325618
Created store item '967207'