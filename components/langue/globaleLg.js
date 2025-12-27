import { loginLg_en, loginLg_fr } from "./lg/loginLg"
import { signupLg_en, signupLg_fr } from "./lg/signupLg"
import { accueilLg_en, accueilLg_fr } from "./lg/accueilLg"
import { deliveriesLg_en, deliveriesLg_fr } from "./lg/deliveriesLg"
import { delivery_detailLg_en, delivery_detailLg_fr } from "./lg/delivery-detailLg"
import { mapLg_en, mapLg_fr } from "./lg/mapLg"
import { profilLg_en, profilLg_fr } from "./lg/profileLg"
import { editProfilLg_en, editProfilLg_fr } from "./lg/editProfilLg"
import { historyLg_en, historyLg_fr } from "./lg/historiqueLg"

export const en = {

  ...loginLg_en,
  ...deliveriesLg_en,
  ...delivery_detailLg_en,
  ...accueilLg_en,
  ...signupLg_en,
  ...profilLg_en,
  ...editProfilLg_en,
  ...mapLg_en,
  ...historyLg_en,



  notLoggedIn: "Not logged in",
  logout: "Log out",
};

export const fr = {
  ...loginLg_fr,
  ...deliveriesLg_fr,
  ...delivery_detailLg_fr,
  ...accueilLg_fr,
  ...signupLg_fr,
  ...profilLg_fr,
  ...editProfilLg_fr,
  ...mapLg_fr,
  ...historyLg_fr,

  permission_scan: "BuyMore-Livraison n'a pas acces a votre",
  notLoggedIn: "Non connecté",
  logout: "Se déconnecter",
};