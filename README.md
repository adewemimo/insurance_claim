# insurance_claim
State diagram, state data and transition function description with chain code for insurance claim in a Canadian insurance company


## State Diagram
![State diagram for insurance claim](https://github.com/adewemimo/insurance_claim/blob/main/Car%20Accident%20Insurance%20Claim%20-%20State%20Diagram.png?raw=true)

## State Data 
* State: [autoInsured (), claimedFiled, assigned, lossFormedCompleted, notAtFault, atFault, claimPaid, claimRejected, increasedInsurance, deductiblePaid]
* Initial State: 0
* •	Claim ID: “”
* Insured status: true
* Name of claimer: “”
* Amount of Loss to Claim: 0
* Policy Number: “”
* Policy Coverage Amount: “”
* Car: {
    * Make: “”, 
    * Model: “”, 
    * Year: “”, 
    * Registration: “”,
    * licence plate number: “” }
* Accident details: {
    * Driver Name: “”, 
    * Not Car owner - Driver’s licence number: “”,
    * DateTime: “”, 
    * Location of the accident: “”,
    * Accident Description: “”,
    * Photo Evidence: “”}
* Injuries Description: “” 
* Number of passengers involved = 0
* Damage to Vehicle: “” 
* Other Drivers Involved: [{
  * Name: “”
  * Driver’s Licence: “”
  * Name of insurance company: “”
  * Insurance Policies No: “” },]
* Investigating officer: {
  * Officer Name: “”,
  * Badge Number: “”,
  * Officer Report: “” }
* At Fault: false
* Name of Adjuster: “”
* Claim Paid: 0, 
* Reject Claim Decision: "", 
* Deductible: 0,

## Functions
### Transition Functions
* fileReport 
* assignAdjuster 
* submitProofOfLoss 
* determineFault 
* payClaim
* rejectClaim
* increaseInsurance 
* deductibleToPay

### Other Functions
* addOtherDrivers
* addPoliceReport
* disagreedOnFaultDecision
* checkInsuranceStatus
* retrieveClaim
* retrieveAllClaim


## Roles
* Insurance Policy Holder
* Claimer
* System / Insurance Company
* Claim Adjuster
* Complaint Officer
* Investigating Officer


# Functions And Roles Descriptions