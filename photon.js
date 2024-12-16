/*jslint browser: true, devel: true */
/*jslint newcap: true */
/*jslint unparam: true */
/*jshint -W093 */
/*global document */
/*exported photon */
function photon() {
    'use strict';
    var abs,
      E_i,
      E_i_read,
      depth,
      PE,
      E_over_MEC2,
      Compton,
      b,
      PP,
      sigma,
      mu_m,
      FINE,
      MEC2,
      R_E,
      N_A,
      EXPONENT,
      prho,
      pa2,
      pz2,
      rho,
      a2,
      z2,
      material,
      gestalt;
    FINE = 0.0072973525664;
    MEC2 = 0.5109989461;
    R_E = 2.8179403227E-13;
    N_A = 6.022140857E+23;
    EXPONENT = 3.5;
    rho = [2.0000E+00, 2.6989E+00, 4.5400E+00, 8.9600E+00, 1.1350E+01, 9.4000E-01, 1.0000E+00, 1.4000E+00, 1.4200E+00, 1.2048E-03, 2.2000E+00, 2.6000E+00, 1.3000E+00, 3.9700E+00, 1.1400E+00]; /*DENSITY*/
    a2 = [12.011, 26.980, 47.867, 63.550, 207.200, 4.676, 6.005, 7.413, 9.803, 14.667, 16.669, 21.648886845, 20.833, 33.987, 37.719]; /*A*/
    z2 = [6.000, 13.000, 22.000, 29.000, 82.000, 2.667, 3.333, 3.946, 5.026, 7.312, 8.000, 10.80461, 10.667, 16.667, 20.667]; /*Z*/
    gestalt = document.forms.gestalt;
    E_i_read = gestalt.elements.E_i_read; /*MeV*/
    E_i = parseFloat(E_i_read.value); /*parse float*/
    material = gestalt.elements.material; /*target*/
    abs = parseInt(material.value, 10); /*parse integer*/
    prho = rho[abs - 1]; /*mass density in g/cm3*/
    pa2 = a2[abs - 1]; /*effective atomic mass in g/mol*/
    pz2 = z2[abs - 1]; /*effective atomic number*/
    if (E_i > 0.1 && E_i < 0.35) { /*photon energy in MeV above the K-absorption edge*/
      PE = 4.0 * Math.pow(FINE, 4) * Math.sqrt(2.0) * Math.pow(pz2, 5) * (8.0 * Math.PI * Math.pow(R_E, 2) / 3.0) * Math.pow(MEC2 / E_i, EXPONENT); /*cross section for photoelectric effect (PE)*/
      document.getElementById('photoelectric').innerHTML = PE.toExponential(7); /*single precision*/
    } else {
      PE = 0.0;
      document.getElementById('photoelectric').innerHTML = "&#8213;"; /*horizontal bar*/
    }
    E_over_MEC2 = E_i / MEC2; /*dimensionless*/
    Compton = (Math.PI * Math.pow(R_E, 2) / E_over_MEC2) * ((1.0 - ((2.0 * E_over_MEC2 + 2.0) / Math.pow(E_over_MEC2, 2))) * Math.log(2.0 * E_over_MEC2 + 1.0) + 0.5 + (4.0 / E_over_MEC2) - 1.0 / (2.0 * Math.pow(2.0 * E_over_MEC2 + 1.0, 2))); /*cross section for Compton scattering*/
    document.getElementById('Compton').innerHTML = Compton.toExponential(7); /*single precision*/
    if (E_i > 2.0 * MEC2) { /*photon energy in MeV below which pair production cannot occur*/
      b = Math.sqrt(1.0 - Math.pow(MEC2 / (E_i + MEC2), 2)); /*beta from special relativity*/
      PP = (Math.PI * Math.pow(R_E, 2) / 2.0) * (1.0 - Math.pow(b, 2)) * ((3.0 - Math.pow(b, 4)) * Math.log((1.0 + b) / (1.0 - b)) - 2.0 * b * (2.0 - Math.pow(b, 2))); /*Gould and SchrÃ©der (1967), cross section for pair production (PP)*/
      document.getElementById('PP').innerHTML = PP.toExponential(7); /*single precision*/
    } else {
      PP = 0.0;
      document.getElementById('PP').innerHTML = "&#8213;"; /*horizontal bar*/
    }
    sigma = PE + pz2 * Compton + PP; /*cm2*/
    document.getElementById('sigma').innerHTML = sigma.toExponential(7); /*single precision*/
    mu_m = N_A * sigma / pa2; /*cm2/g*/
    depth = 1.0 / mu_m; /*probability of non-absorption has dropped to 1/e*/
    document.getElementById('attenuation').innerHTML = (depth / prho).toFixed(15); /*double precision*/
  }