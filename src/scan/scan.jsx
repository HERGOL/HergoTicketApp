import React, { useState } from 'react';
import QrReader from 'react-qr-scanner';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import Swal from 'sweetalert2';


const firebaseConfig = {
  apiKey: "AIzaSyCMJYaWP-sdQ93_SHVVbrV-D2FQBasWBlc",
  authDomain: "hergotickets.firebaseapp.com",
  projectId: "hergotickets",
  storageBucket: "hergotickets.appspot.com",
  messagingSenderId: "1022366768612",
  appId: "1:1022366768612:web:394e4097ba2f9112a47bf1",
  measurementId: "G-Q5B6ZKKQH4"
};

firebase.initializeApp(firebaseConfig);

const Scanner = () => {
  const [qrValue, setQrValue] = useState(null);
  const [ticketValidated, setTicketValidated] = useState(false);
  const [scanning, setScanning] = useState(false);

  const handleScan = async (data) => {
    if (data && !scanning) {
      setScanning(true);
      setQrValue(data.text);
      console.log(handleScan);
  
      const db = firebase.firestore();
      console.log(db);
      const docRef = db.collection('tickets').doc(data.text);
      const doc = await docRef.get();
      if (doc.exists) {
        if (doc.data().validated) {
          setTicketValidated(false);
          Swal.fire(
            'Ticket déjà validé!',
            '',
            'warning'
          );
        } else {
          setTicketValidated(true);
          await docRef.update({ validated: true });
          Swal.fire(
            'Ticket Valide!',
            '',
            'success'
          );
        }
      } else {
        setTicketValidated(false);
        Swal.fire(
          'Ticket Invalide!',
          '',
          'error'
        );
      }
      setScanning(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };
  function ReScan() {
    window.location.reload(false);
  };

  return (
    <div style={{ textAlign: 'center' }}>
    <div style={{ backgroundColor: '#008CBA', color: 'white', padding: '10px 0' }}>
      <h1 style={{ margin: 0 }}>Hergol Tickets</h1>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <QrReader
        delay={500}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%', maxWidth: '400px', borderRadius: '5px', marginTop: '20px' }}
        facingMode='rear'
      />
      {qrValue && (
        <div style={{ borderRadius: '10px', marginTop: '20px', maxWidth: '400px', width: '100%' }}>
          <p style={{ fontSize: '20px' }}>Dernière valeur scannée: {qrValue}</p>
          {ticketValidated ? (
          <p>Le ticket a été scanné et validé avec succès !</p>
         ) : (
          <p>{qrValue} est un ticket {ticketValidated ? 'déjà validé' : 'non valide'}</p>
          )}
          <button
            onClick={ReScan}
            style={{ marginTop: '20px', fontSize: '16px', padding: '10px 20px', backgroundColor: '#008CBA', color: 'white', borderRadius: '5px', border: 'none' }}
          >
            ⟳ Rescan
          </button>
        </div>
      )}
    </div>
    <div style={{ textAlign: 'center', marginTop: '225px' }}>
      <div style={{ backgroundColor: '#008CBA', color: 'white', padding: '10px 0' }}>
        <h3 style={{ margin: 0 }}>Contact</h3>
        <h3 style={{ margin: 0 }}>0557349837</h3>
      </div>
    </div>
  </div>
  
    

  );
};

export default Scanner;