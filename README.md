## Waiver Signer

This app allows users to electronically sign waivers. It handles:

- Displaying waivers to sign
- Validating that all required fields are signed
- Filling in the waiver with required fields
- Capturing electronic signatures
- Saving signed waivers as PDF files to Firebase Storage
- Storing metadata like user info and waiver details in Firebase Firestore database
- Todo: Emailing signed waivers to the user and organizers

We use this for our little sailing charter business. It's great to have waivers signed electronically rather than handling paper. Now we just need to add the ability to email the signed PDF waiver to the user and whoever organizes our trips.