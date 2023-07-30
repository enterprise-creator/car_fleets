// src/PrintDocuments.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, limit, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore/lite';
import { AgGridReact } from 'ag-grid-react';
import React, { useEffect, useState } from 'react';

const firebaseConfig = {
  apiKey: "AIzaSyDYpKDtHuEwU4lKzM1FiIyjxd4d_PqaT6g",
  authDomain: "fir-project-8efcd.firebaseapp.com",
  projectId: "fir-project-8efcd",
  storageBucket: "fir-project-8efcd.appspot.com",
  messagingSenderId: "48133128965",
  appId: "1:48133128965:web:803b53acc6be4a9f85ad6c",
  measurementId: "G-7G197HXJGS"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const PrintDocuments = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchAllDocuments = async () => {
      try {
        const carsDataRef = collection(db, 'cars_data');
        const snapshot = await getDocs(query(carsDataRef, limit(3)));

        const data = [];
        snapshot.forEach((doc) => {
          data.push({ docId: doc.id, ...doc.data() });
        });

        setDocuments(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAllDocuments();
  }, []);

  const handleCellValueChanged = async (params) => {
    const { docId } = params.data; // Get the Firestore document ID
    const field = params.colDef.field; // Get the field of the updated cell
    const newValue = params.newValue; // Get the new value for the updated cell
  
    // For other columns (not "Origin" or "Destination"), update the specific field and save to Firestore
    if (field !== "ol.l" && field !== "dl.l") {
      setDocuments((prevDocuments) =>
        prevDocuments.map((doc) =>
          doc.docId === docId ? { ...doc, [field]: newValue } : doc
        )
      );
  
      try {
        const docRef = doc(collection(db, 'cars_data'), docId); // Use the Firestore document ID here
        await updateDoc(docRef, { [field]: newValue });
        console.log('Update successful!');
      } catch (error) {
        console.error('Error updating data:', error);
      }
    }
  };
  
  const handleOriginValueChanged = async (params) => {
    const { docId } = params.data; // Get the Firestore document ID
    const newValue = params.newValue; // Get the new value for "Origin"
  
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc.docId === docId ? { ...doc, ol: { ...doc.ol, l: newValue } } : doc
      )
    );
  
    try {
      const docRef = doc(collection(db, 'cars_data'), docId);
      await updateDoc(docRef, { 'ol.l': newValue });
      console.log('Origin Update successful!');
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };
  
  const handleDestinationValueChanged = async (params) => {
    const { docId } = params.data; // Get the Firestore document ID
    const newValue = params.newValue; // Get the new value for "Destination"
  
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc.docId === docId ? { ...doc, dl: { ...doc.dl, l: newValue } } : doc
      )
    );
  
    try {
      const docRef = doc(collection(db, 'cars_data'), docId);
      await updateDoc(docRef, { 'dl.l': newValue });
      console.log('Destination Update successful!');
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };
  
  // ... Rest of the component code
  
  

  

  const columnDefs = [
    { headerName: 'Load ID', field: 'id', filter: true, editable: true },
    { headerName: 'Shipper', field: 'sn', filter: true, editable: true },
    { headerName: 'Pickup Date', field: 'pdt', filter: true, editable: true },
    { headerName: 'Delivery Date', field: 'ddt', filter: true, editable: true },
    {
      headerName: 'Units',
      valueGetter: (params) => {
        const units = params.data.u;
        return units ? units.length : 0;
      },
      filter: 'agNumberColumnFilter',
      editable: true,
      valueSetter: handleCellValueChanged,
    },
    {
      headerName: 'Origin',
      field: 'ol.l',
      filter: true,
      editable: true,
      valueGetter: (params) => {
        const origin = params.data.ol;
        return origin ? origin.l : 'N/A';
      },
      valueSetter: handleOriginValueChanged,
    },
    {
      headerName: 'Destination',
      field: 'dl.l', // Corrected field path
      filter: true,
      editable: true,
      valueGetter: (params) => {
        const destination = params.data.dl;
        return destination ? destination.l : 'N/A';
      },
      valueSetter: handleDestinationValueChanged,
    },
    
    { headerName: 'Distance', field: 'd', filter: 'agNumberColumnFilter', editable: true, floatingFilter: true },
    { headerName: 'Instructions', field: 'in', filter: true, editable: true, floatingFilter: true },
  ];

  const defaultColDef = {
    sortable: true,
    resizable: true,
    floatingFilter: true
  };

  return (
    <div>
      <h2>All Documents</h2>
      {documents.length > 0 ? (
        <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
          <AgGridReact
            rowData={documents}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onCellValueChanged={handleCellValueChanged}
          />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PrintDocuments;