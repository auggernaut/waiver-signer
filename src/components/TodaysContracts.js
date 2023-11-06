import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

function TodaysContracts() {
    const [contracts, setContracts] = useState([]);

    useEffect(() => {
        fetchTodaysContracts();
    }, []);

    const fetchTodaysContracts = async () => {
        const db = getFirestore();
        // Start of today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // End of today
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Convert the JavaScript Date objects to Firestore Timestamps
        const startTimestamp = Timestamp.fromDate(startOfDay);
        const endTimestamp = Timestamp.fromDate(endOfDay);

        const contractsRef = collection(db, 'contracts');
        const q = query(contractsRef, where('date', '>=', startTimestamp), where('date', '<=', endTimestamp));

        const querySnapshot = await getDocs(q);
        const todaysContracts = [];
        querySnapshot.forEach((doc) => {
            todaysContracts.push(doc.data().name);
        });
        setContracts(todaysContracts);
    };

    return (
        <div className="container">
            <div className="title">
                Today's Contracts: {contracts.length}
            </div>
            <ul className="contract-list">
                {contracts.map((contractName, index) => (
                    <li key={index} className="contract-list-item">{contractName}</li>
                ))}
            </ul>
        </div>
    );
}

export default TodaysContracts;
