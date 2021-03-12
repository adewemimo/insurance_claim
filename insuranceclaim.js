/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');


class InsuranceClaim extends Contract {
    newState = 0; 
    claimID = 0;

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const claims = [
            {
                state: newState,
                claimID = "",
                claimerName: "",
                insuredStatus: true,
                amountOfLoss: "",
                policyNumber:"",
                policyCoverageAmount: 0,
                Car: {
                    make: "", 
                    model: "", 
                    year: "", 
                    registration: "",
                    licencePlateNumber: "",
                },
                accidentDetails: {
                    driverName: "", 
                    driverLicenceNumber: "",
                    date: "",
                    time: "",
                    locationOfAccident: "",
                    description: "",
                    PhotoEvidence: "",  
                    receiptEvidence: "", 
                },
            injuriesDescription: "",
            noOfPassengers = 0,
            damageToVehicle: "",
            otherDrivers: [
                {
                name: "",
                driverLicence: "",
                insuranceCompanyName: "",
                insurancePolicyNo: "",
            },
            ],
            investigatingOfficer: {
                officerName: "",
                badgeNumber: "",
            },
            atFault: false,
            adjusterName: "",
            claimedPaid: 0,
            rejectClaimDecision: "", 
            deductible:0,

            },
        
        ];

        for (let i = 0; i < claims.length; i++) {
            claims[i].docType = 'claim';
            await ctx.stub.putState('CLAIM' + i, Buffer.from(JSON.stringify(claims[i])));
            console.info('Added <--> ', claims[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }
   
    async fileReport(ctx, claimerName, policyNumber, policyCoverageAmount, make, model, year, registration, licencePlateNumber, driverName, driverLicenceNumber, location, accidentDescription, injuriesDescription, noOfPassenger, damageToVehicle, officerName, officerBadgeNumber ){
        console.info('============= START : File Report ===========');
        this.newState = 1;
        this.claimID++;
        recClaimID = 'CLAIM' + this.claimID;

        const claim = {
            state = this.newState,
            claimID: recClaimID,
            docType: 'claim',
            claimerName: claimerName,
            insuredStatus: true,
            policyNumber: policyNumber,
            policyCoverageAmount: policyCoverageAmount,
            car:{
                make: make,
                model: model,
                year: year,
                registration: registration,
                licencePlateNumber: licencePlateNumber,
            },
            accidentDetails: {
                driverName: driverName, 
                driverLicenceNumber: driverLicenceNumber,
                dateTime: new Date(),
                locationOfAccident: location,
                description: accidentDescription,
            },
            injuriesDescription: injuriesDescription,
            noOfPassengers = noOfPassenger,
            damageToVehicle: damageToVehicle,
            investigatingOfficer: {
                officerName: officerName,
                badgeNumber: officerBadgeNumber,
            },
            atFault: false,
            claimPaid: 0, 
            deductible:0,
        };

        await ctx.stub.putState(recClaimID, Buffer.from(JSON.stringify(claim)));
        console.info('============= END : File Report ===========');
    }

    async addOtherDrivers(ctx, claimID, driverName, driverLicenceNumber, driverInsurer, DriverInsurancePolicyNumber ){
        // state is still at 1
        console.info('============= START : Add other Driver Involved ===========');
        const claimAsBytes = await ctx.stub.getState(claimID); // get the claim from chaincode state
        if (!claimAsBytes || claimAsBytes.length === 0) {
            throw new Error(`${claimAsBytes} does not exist`);
        }
        const claim = JSON.parse(claimAsBytes.toString());

        claim.otherDrivers.name = driverName;
        claim.otherDrivers.driverLicence = driverLicenceNumber;
        claim.otherDrivers.insuranceCompanyName = driverInsurer;
        claim.otherDrivers.insurancePolicyNo = DriverInsurancePolicyNumber;

        await ctx.stub.putState(claimID, Buffer.from(JSON.stringify(claim)));
        console.info('============= END : Add other Driver Involved  ===========');
    }

    async assignAdjuster(ctx, claimID, adjusterName){
        
        console.info('============= START : Assign Adjuster to claim ===========');
        this.newState = 2;
        const claimAsBytes = await ctx.stub.getState(claimID); // get the claim from chaincode state
        if (!claimAsBytes || claimAsBytes.length === 0) {
            throw new Error(`${claimAsBytes} does not exist`);
        }
        const claim = JSON.parse(claimAsBytes.toString());

        claim.state = this.newState;
        claim.adjusterName = adjusterName;

        await ctx.stub.putState(claimID, Buffer.from(JSON.stringify(claim)));
        console.info('============= END : Assign Adjuster to claim   ===========');

    }

    async submitProofOfLoss(ctx, claimID,amountOfLoss, photoEvidence, receiptEvidence ){
        console.info('============= START : Submit Proof of Loss Form ===========');
        this.newState = 3;
        const claimAsBytes = await ctx.stub.getState(claimID); // get the claim from chaincode state
        if (!claimAsBytes || claimAsBytes.length === 0) {
            throw new Error(`${claimAsBytes} does not exist`);
        }
        const claim = JSON.parse(claimAsBytes.toString());

        claim.state = this.newState;
        claim.amountOfLoss = amountOfLoss;
        claim.accidentDetails.photoEvidence = photoEvidence;
        claim.accidentDetails.receiptEvidence = receiptEvidence;

        await ctx.stub.putState(claimID, Buffer.from(JSON.stringify(claim)));
        console.info('============= END : Submit Proof of Loss Form   ===========');

    }

    async determineFault(ctx, claimID, faultDecision) {
        console.info('============= START : Determine Fault ===========');
        const claimAsBytes = await ctx.stub.getState(claimID); // get the claim from chaincode state
        if (!claimAsBytes || claimAsBytes.length === 0) {
            throw new Error(`${claimAsBytes} does not exist`);
        }
        const claim = JSON.parse(claimAsBytes.toString());
        if (claim.atFault !== faultDecision){
            claim.atFault = faultDecision;
        };
        if (claim.atFault !== false){
            this.newState = 5;
        }
        else{
            this.newState = 4;
        };
        
        claim.state = this.newState;
        await ctx.stub.putState(claimID, Buffer.from(JSON.stringify(claim)));
        console.info('============= END : Determine Fault   ===========');
    }

    async disagreedOnFaultDecision(ctx, claimID, newFaultDecision){
        console.info('============= START : Change Fault Decision ===========');
        const claimAsBytes = await ctx.stub.getState(claimID); // get the claim from chaincode state
        if (!claimAsBytes || claimAsBytes.length === 0) {
            throw new Error(`${claimAsBytes} does not exist`);
        }
        const claim = JSON.parse(claimAsBytes.toString());
        if (claim.atFault !== newFaultDecision){
            claim.atFault = newFaultDecision;
        };
        //checking the new value of atFault
        if (claim.atFault == true){
            claim.state = claim.state + 1;
        }
        else{
            claim.state = claim.state - 1;
        };

        await ctx.stub.putState(claimID, Buffer.from(JSON.stringify(claim)));
        console.info('============= END : Change Fault Decision  ===========');
    } 

    async payClaim(ctx, claimID, amount) {
        console.info('============= START : Claim Payment===========');
        const claimAsBytes = await ctx.stub.getState(claimID); // get the claim from chaincode state
        if (!claimAsBytes || claimAsBytes.length === 0) {
            throw new Error(`${claimAsBytes} does not exist`);
        }
        const claim = JSON.parse(claimAsBytes.toString());

        this.newState = 6;
        claim.claimPaid = amount;
        claim.state = this.newState;

        await ctx.stub.putState(claimID, Buffer.from(JSON.stringify(claim)));

        console.info('============= END : Claim Payment ===========');
    }

    // reject decision is either yes or no.
    async rejectClaim(ctx, claimID, rejectDecision){
        console.info('============= START : Reject claim request ===========');
        const claimAsBytes = await ctx.stub.getState(claimID); // get the claim from chaincode state
        if (!claimAsBytes || claimAsBytes.length === 0) {
            throw new Error(`${claimAsBytes} does not exist`);
        }
        const claim = JSON.parse(claimAsBytes.toString());

        this.newState = 7;
        claim.rejectClaimDecision = rejectDecision;
        claim.state = this.newState; 

        await ctx.stub.putState(claimID, Buffer.from(JSON.stringify(claim)));
        console.info('============= END : Reject claim request ===========');

    }

    async checkInsuranceStatus(ctx, claimID) {
        const claimAsBytes = await ctx.stub.getState(claimID); // get the claim from chaincode state
        if (!claimAsBytes || claimAsBytes.length === 0) {
            throw new Error(`${claimAsBytes} does not exist`);
        }
        const claim = JSON.parse(claimAsBytes.toString());
        if (claim.insuredStatus === true){
         console.info("Claimer record shows insured");
         return "Claimer record shows insured";
        }
    }

    async increaseInsurance(ctx, claimID, newPolicyCoverageAmount) {
        console.info('============= START : Increase insurance policy coverage ===========');
        const claimAsBytes = await ctx.stub.getState(claimID); // get the claim from chaincode state
        if (!claimAsBytes || claimAsBytes.length === 0) {
            throw new Error(`${claimAsBytes} does not exist`);
        }
        const claim = JSON.parse(claimAsBytes.toString());

        this.newState = 8
        claim.state = this.newState; 
        claim.policyCoverageAmount = newPolicyCoverageAmount;

        await ctx.stub.putState(claimID, Buffer.from(JSON.stringify(claim)));

        console.info('============= END : Increase insurance policy coverage ===========');
    }

    async deductibleToPay(ctx, claimID, amount) {
        console.info('============= START : Deductible for Insurer to pay after found at Fault ===========');
        const claimAsBytes = await ctx.stub.getState(claimID); // get the claim from chaincode state
        if (!claimAsBytes || claimAsBytes.length === 0) {
            throw new Error(`${claimAsBytes} does not exist`);
        }
        const claim = JSON.parse(claimAsBytes.toString());

        this.newState = 9
        claim.state = this.newState; 
        claim.deductible = amount;

        await ctx.stub.putState(claimID, Buffer.from(JSON.stringify(claim)));

        console.info('============= END :  Deductible for Insurer to pay after found at Fault ===========');

    }

}

module.exports = InsuranceClaim;
