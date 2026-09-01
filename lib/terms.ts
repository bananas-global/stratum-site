export type TermsItem = {
  text: string;
  items: string[];
};

export type TermsClause = {
  heading: string | null;
  text: string;
  items: TermsItem[];
};

export type TermsSection = {
  id: string;
  title: string;
  clauses: TermsClause[];
};

export const TERMS_INTRO = "These terms and conditions apply to all customers and clients of Stratum IT Solutions who use any of Stratum’s services, licenses, or otherwise engage with Stratum, and may be modified by Stratum from time to time as required without notice.";

export const TERMS_SECTIONS: TermsSection[] = [
  {
    "id": "definitions",
    "title": "Definitions",
    "clauses": [
      {
        "heading": "Definitions.",
        "text": "In this Agreement, the following terms have the meanings set out below:",
        "items": [
          {
            "text": "“After-Hours Support” means Services provided outside of Business Hours;",
            "items": []
          },
          {
            "text": "“After-Hours Support Rate” means the hourly rate charged by Stratum for After-Hours Support, as set out in the billing rate table in the Services Agreement;",
            "items": []
          },
          {
            "text": "“Business Days” means Monday to Friday (inclusive), excluding statutory holidays;",
            "items": []
          },
          {
            "text": "“Business Hours” means 8:00 a.m. to 5:00 p.m. Monday through Friday, excluding statutory holidays in, unless otherwise agreed in writing by the parties;",
            "items": []
          },
          {
            "text": "“Confidential Information” has the meaning given to it in this Agreement hereof;",
            "items": []
          },
          {
            "text": "“Customer Data” means the Customer’s business data, files, records, emails, credentials, configurations, documentation, personal information, and other information Stratum may access while providing the Services;",
            "items": []
          },
          {
            "text": "“Fees” means all amounts payable by the Customer to Stratum under this Agreement;",
            "items": []
          },
          {
            "text": "“Minimum Requirements” has the meaning given to it in this Agreement;",
            "items": []
          },
          {
            "text": "“Monthly Service Plan Fee” means the monthly fee payable by the Customer to Stratum for the Services under the Service Plan, as set out in Services Agreement, excluding After-Hours Support charges, Project work, Reimbursable Expenses, overage charges, and Out-of-Scope Work costs, and “Monthly Service Plan Fees” means any two or more such fees;",
            "items": []
          },
          {
            "text": "“Out-of-Scope Work” means work or services that fall outside the scope of the work described in the Services Agreement or Service Documentation, and that have not otherwise been agreed to by the parties in writing as part of the Services. Out-of-Scope Work may include, without limitation, special projects, major migrations, new system deployments, software development, major infrastructure changes, and large remediation projects. Out-of-Scope Work becomes part of the Services upon acceptance of a Proposal;",
            "items": []
          },
          {
            "text": "“Overage Rate” means the hourly rate charged by Stratum for work or Help Desk Support performed during Business Hours;",
            "items": []
          },
          {
            "text": "“Reimbursable Expenses” means costs incurred by Stratum on the Customer’s behalf in connection with the provision of the Services, including without limitation the cost of Third-Party Services, hardware, software licensing, subscriptions, vendor fees, and other out-of-pocket expenses reasonably required to deliver the Services;",
            "items": []
          },
          {
            "text": "“Service Documentation” has the meaning given to it in this Agreement hereof;",
            "items": []
          },
          {
            "text": "“Service Plan” means the plan set out in the Services Agreement, which specifies the Included Monthly Hours for each category of Services and the resulting Monthly Service Plan Fee payable by the Customer;",
            "items": []
          },
          {
            "text": "“Services” means collectively the all services provided by Stratum to the Customer agreed to by the parties in writing, including Out-of-Scope Work;",
            "items": []
          },
          {
            "text": "“Standard Hourly Rate” means the hourly rate used to calculate the Monthly Service Plan Fee;",
            "items": []
          },
          {
            "text": "“Stratum IP” has the meaning given to it in this Agreement hereof;",
            "items": []
          },
          {
            "text": "“Target Response Times” has the meaning given to it in this Agreement hereof;",
            "items": []
          },
          {
            "text": "“Third-Party Services” means products or services supplied by outside vendors, including software, cloud services, licensing, hosting, hardware, warranty programs, internet services, security tools, backup platforms, and similar services that Stratum may procure or manage on the Customer’s behalf; and",
            "items": []
          },
          {
            "text": "“Vendor Terms” has the meaning given to it in this Agreement hereof.",
            "items": []
          }
        ]
      }
    ]
  },
  {
    "id": "services-general",
    "title": "Services - General",
    "clauses": [
      {
        "heading": "Provision of Services.",
        "text": "Subject to the terms and conditions of this Agreement, Stratum will provide the Services described as and when requested by the Customer from time to time, as may be amended by mutual written agreement of the parties from time to time.",
        "items": []
      },
      {
        "heading": "Acceptable Use.",
        "text": "The Customer agrees that it will only use the Services in strict accordance with the terms of this Agreement, will follow all policies developed from time to time by Stratum relating to the Services, and will otherwise refrain from conduct harmful or potentially harmful to the Services or Stratum’s name, reputation or business.",
        "items": []
      },
      {
        "heading": "Legal Compliance.",
        "text": "The Customer agrees that it will not use the Services in any way that contravenes applicable federal, provincial or other laws, including without limitation applicable privacy laws (and including the specific privacy compliance obligations set out in this Agreement).",
        "items": []
      },
      {
        "heading": "Subcontracting.",
        "text": "In providing the Services, Stratum shall be entitled to use such subcontractors and employees as Stratum, in its sole discretion, may determine from time to time, provided that Stratum uses reasonable measures to protect Customer Data when so doing.",
        "items": []
      }
    ]
  },
  {
    "id": "customer-responsibilities",
    "title": "Customer Responsibilities",
    "clauses": [
      {
        "heading": null,
        "text": "Contacts and Access. The Customer acknowledges that good service depends on clear communication, current information, and timely access. The Customer will provide a primary IT contact, an emergency contact for after-hours issues that may affect next-business-day operations, and appropriate contacts for quote approvals, purchase approvals, and accounts payable. The Customer will provide timely access to systems, users, vendors, records, credentials, documentation, and locations reasonably required by Stratum to perform the Services.",
        "items": []
      },
      {
        "heading": "Notification Obligations.",
        "text": "The Customer will keep Stratum informed of staffing changes, device changes, vendor changes, business changes, suspected security incidents, data loss, or unauthorized access.",
        "items": []
      },
      {
        "heading": "User Cooperation.",
        "text": "The Customer is responsible for ensuring that users cooperate with reasonable support and security requests, that recommendations or project decisions are reviewed and approved in a timely manner, and that technology systems, accounts, credentials, and services are used lawfully and responsibly. The Customer is responsible for maintaining appropriate internal policies, user training, insurance, business controls, backups, and business continuity plans, unless those items are expressly included in Stratum’s scope under this Agreement.",
        "items": []
      },
      {
        "heading": "Minimum Technology Requirements.",
        "text": "The Customer acknowledges that the effective and secure delivery of the Services depends on the Customer maintaining a technology environment that meets minimum hardware and software standards. The Customer will, at its own cost, ensure that all hardware and software used in connection with the Services meets the minimum requirements as determined by Stratum from time to time and communicated to the Customer in writing (the “Minimum Requirements”). The Customer will promptly install, maintain, and keep current all software reasonably required by Stratum to deliver the Services, including without limitation remote management agents, endpoint security tools, monitoring software, backup agents, and other tools specified by Stratum from time to time. Stratum may update the Minimum Requirements on reasonable written notice to the Customer. Stratum is not responsible for service degradation, security incidents, delays, additional costs, or failures caused by the Customer’s use of hardware or software that does not meet the Minimum Requirements or by the Customer’s failure to install software required by Stratum under this Section.",
        "items": []
      },
      {
        "heading": "Consequences of Non-Compliance.",
        "text": "Stratum is not responsible for delays, additional cost, service issues, or security exposure caused by missing information, delayed approvals, unavailable access, the Customer’s failure to maintain Minimum Requirements, or the Customer’s failure to meet its other responsibilities set out in this Section.",
        "items": []
      }
    ]
  },
  {
    "id": "third-party-services",
    "title": "Third-Party Services",
    "clauses": [
      {
        "heading": "Vendor Terms.",
        "text": "The Customer acknowledges that many technology services depend on third-party vendors and platforms that Stratum does not own or control. Third-Party Services may be subject to their own vendor terms, licence agreements, acceptable use policies, privacy policies, service levels, warranty terms, pricing changes, renewal terms, data retention rules, support limitations, and cancellation requirements (the “Vendor Terms”). The Customer acknowledges that:",
        "items": [
          {
            "text": "where Stratum procures or manages Third-Party Services on the Customer’s behalf, the costs of those services will be invoiced as Reimbursable Expenses in accordance with this Agreement;",
            "items": []
          },
          {
            "text": "the Customer is responsible for reviewing and complying with all applicable Vendor Terms, and Stratum is not responsible for advising the Customer on the legal or commercial implications of any Vendor Terms;",
            "items": []
          },
          {
            "text": "the Customer’s use of Third-Party Services must comply with all applicable Vendor Terms, and the Customer will not use any Third-Party Service in a manner that violates the applicable Vendor Terms or that could expose Stratum to liability under those terms; and",
            "items": []
          },
          {
            "text": "where Stratum becomes aware of a material change to Vendor Terms that is likely to affect the Customer’s costs or use of a Third-Party Service, Stratum will make reasonable efforts to notify the Customer, but Stratum is not responsible for monitoring all Vendor Terms changes or for any failure to provide such notice.",
            "items": []
          }
        ]
      },
      {
        "heading": "No Liability for Vendor Failures.",
        "text": "Stratum is not responsible for vendor outages, vendor security incidents, vendor support delays, vendor pricing changes, vendor service changes, discontinued products, or third-party failures, except to the extent directly caused by Stratum’s negligence or wilful misconduct.",
        "items": []
      },
      {
        "heading": "Authorization.",
        "text": "Where Stratum procures or manages Third-Party Services for the Customer, the Customer authorizes Stratum to act as the Customer’s limited agent for the purposes of interacting with applicable vendors, accepting Vendor Terms on the Customer’s behalf, renewing or modifying service arrangements, making reasonable administrative changes, and taking other actions reasonably required to procure, manage, or maintain Third-Party Services in connection with the provision of the Services. This authorization does not create a general agency relationship between the parties. Stratum may decline to follow Customer instructions that would, in Stratum’s reasonable opinion, breach applicable Vendor Terms or expose Stratum to liability under those terms. Vendor accounts procured by Stratum specifically for the Customer are held for the Customer’s benefit, subject to payment of all outstanding Fees. Upon termination of this Agreement and payment of all outstanding Fees, Stratum will use reasonable efforts to facilitate the transfer of such accounts to the Customer or its nominee in accordance with the applicable Vendor Terms.",
        "items": []
      }
    ]
  },
  {
    "id": "security-privacy-and-customer-data",
    "title": "Security, Privacy, And Customer Data",
    "clauses": [
      {
        "heading": "Shared Responsibility.",
        "text": "Stratum provides services intended to reduce risk, improve security posture, and support operational stability. However, no technology provider can guarantee complete security, uninterrupted service, prevention of all cyber incidents, or recovery from every event. The Customer understands that cybersecurity is a shared responsibility and that results depend on user behaviour, timely approvals, vendor performance, software vulnerabilities, funding decisions, configuration decisions, insurance coverage, internal controls, and business processes. The Customer’s specific responsibilities in support of this shared responsibility model are set out in this Agreement. The limitations on Stratum’s liability arising from the shared nature of cybersecurity responsibility are set out in this Agreement.",
        "items": []
      },
      {
        "heading": "Standard of Care.",
        "text": "Stratum will use reasonable professional care in providing the Services. Stratum does not guarantee that the Customer will be free from malware, ransomware, phishing, compromise, unauthorized access, data loss, downtime, misconfiguration, software defects, vendor failure, or other technology-related events. The disclaimers and limitations applicable to the Services, including in connection with security-related events, set out in this Agreement.",
        "items": []
      },
      {
        "heading": "Privacy Compliance.",
        "text": "Each party will comply with applicable privacy laws relating to personal information, including without limitation British Columbia’s Personal Information Protection Act and Canada’s Personal Information Protection and Electronic Documents Act, as applicable. The Customer is responsible for determining what personal information it collects, uses, stores, processes, and discloses, and for ensuring it has the appropriate legal authority, consent, notices, policies, safeguards, and retention practices for its business. The Customer represents and warrants that it has the legal authority to provide Stratum with access to any personal information contained in Customer Data in connection with the provision of the Services. The Customer will promptly notify Stratum of any known or suspected privacy breach involving Customer Data that Stratum holds or accesses. To the extent that Customer Data constitutes Confidential Information under this Agreement; in the event of any conflict, the more protective provision will govern.",
        "items": []
      },
      {
        "heading": "Stratum’s Use of Customer Data.",
        "text": "Stratum may access, collect, use, store, process, or disclose Customer Data, including personal information contained therein, only as reasonably required to provide the Services, administer this Agreement, comply with law, protect systems, respond to incidents, manage accounts, or as otherwise authorized by the Customer. Where Stratum uses subcontractors, employees, vendors, cloud platforms, or other service providers to assist in providing the Services, Stratum will protect Customer Data in accordance with this Agreement.",
        "items": []
      },
      {
        "heading": "Customer Data Ownership and Backups.",
        "text": "The Customer owns its Customer Data. Unless backup services are clearly included in the Service Plan or a separate written agreement, the Customer is responsible for maintaining appropriate backups and business continuity procedures. Where Stratum provides backup-related services, the Customer understands that backup and restoration depend on Third-Party Services, configuration, available restore points, storage status, retention settings, successful backup completion, access, and the condition of the source data. Stratum’s liability in respect of any failure or limitation of Third-Party Services used in connection with backup or restoration is subject to this Agreement.",
        "items": []
      },
      {
        "heading": "Return and Deletion of Customer Data.",
        "text": "Upon termination of this Agreement for any reason, and subject to any applicable legal retention requirements, Stratum will, upon written request from the Customer made within thirty (30) days of the effective date of termination, make reasonable efforts to provide the Customer with access to or a copy of Customer Data held by Stratum in connection with the Services, in a format reasonably accessible to the Customer, provided that all outstanding Fees have been paid in full and provided that all work related to same will be billed as transition services in accordance with this Agreement. After sixty (60) days following the effective date of termination, Stratum may delete or destroy Customer Data in its possession without further notice to the Customer. Stratum is not responsible for Customer Data held by Third-Party Services platforms, which will be governed by the applicable Vendor Terms. Nothing in this Section limits Stratum’s right to retain records as required by applicable law or its own reasonable record-keeping practices",
        "items": []
      }
    ]
  },
  {
    "id": "disclaimer",
    "title": "Disclaimer",
    "clauses": [
      {
        "heading": "Disclaimer of Warranties.",
        "text": "While Stratum endeavours to provide reliable and secure services to its customers at all times, the Customer expressly understands and agrees that:",
        "items": [
          {
            "text": "The Services are provided on an “AS IS” and “AS AVAILABLE” basis, and any use of, or reliance on, the Services is at the Customer’s sole risk; and",
            "items": []
          },
          {
            "text": "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, STRATUM AND ITS LICENSORS, LICENSEES, AFFILIATES, AND SUBSIDIARIES, AND EACH OF THEIR RESPECTIVE DIRECTORS, OFFICERS, EMPLOYEES, AND AGENTS, EXPRESSLY DISCLAIM ALL REPRESENTATIONS AND WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, BY OPERATION OF LAW OR OTHERWISE, WITH RESPECT TO THE SERVICES, INCLUDING WITHOUT LIMITATION:",
            "items": [
              "Warranties or conditions of title and non-infringement;",
              "Warranties or conditions that the Services will meet the Customer’s requirements or expectations, that the Services will be available, uninterrupted, secure, error-free, or free of defects, computer viruses or other harmful components or that the results that may be obtained through use of the Services will be complete, accurate or reliable;",
              "Warranties or conditions as to security OR, AS TO THE COMPLETENESS, ACCURACY, OR SUCCESS OF ANY BACKUP OR DATA RESTORATION, INCLUDING WHERE BACKUP OR RESTORATION DEPENDS ON THIRD-PARTY SERVICES, CONFIGURATION, RESTORE POINTS, STORAGE STATUS, RETENTION SETTINGS, OR THE CONDITION OF THE SOURCE DATA;",
              "WARRANTIES OR CONDITIONS AS TO THE PERFORMANCE, AVAILABILITY, SECURITY, ACCURACY, OR RELIABILITY OF ANY THIRD-PARTY SERVICE, WHICH ARE PROVIDED SUBJECT TO THEIR OWN VENDOR TERMS AND ARE NOT WARRANTED BY STRATUM; and",
              "Warranties or conditions arising from any course of dealing, course of performance or usage of trade, with respect to the Services;"
            ]
          }
        ]
      },
      {
        "heading": "No Additional Warranties.",
        "text": "No information, whether oral or written, obtained by the Customer from Stratum, its licensees, contractors or employees will create any warranty not expressly stated in this Agreement.",
        "items": []
      }
    ]
  },
  {
    "id": "limitation-of-liability",
    "title": "Limitation Of Liability",
    "clauses": [
      {
        "heading": "No Liability for Disclaimed Matters.",
        "text": "To the maximum extent permitted by applicable law, Stratum has no liability whatsoever, whether based on contract, tort, negligence, strict liability, misrepresentation, breach of duty, breach of statutory duty, or any other legal or equitable basis, arising from or in connection with any matter that is specifically disclaimed or excluded elsewhere in this Agreement, including without limitation:",
        "items": [
          {
            "text": "the failure to meet Target Response Times or resolve issues within any particular timeframe, as described in this Agreement;",
            "items": []
          },
          {
            "text": "vendor outages, vendor security incidents, vendor support delays, vendor pricing changes, vendor service changes, or discontinued products;",
            "items": []
          },
          {
            "text": "the failure to guarantee complete security, uninterrupted service, prevention of cyber incidents, or recovery from any event;",
            "items": []
          },
          {
            "text": "malware, ransomware, phishing, compromise, unauthorized access, data loss, downtime, misconfiguration, software defects, or vendor failure;",
            "items": []
          },
          {
            "text": "the failure or incompleteness of backup or data restoration services; and",
            "items": []
          },
          {
            "text": "any failure, incident, or loss arising from the Customer’s failure to implement Stratum’s reasonable recommendations, the Customer’s failure to maintain the Minimum Requirements or the Customer’s failure to meet its other responsibilities.",
            "items": []
          }
        ]
      },
      {
        "heading": "Exclusion of Indirect Damages.",
        "text": "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL STRATUM OR ANY OF ITS LICENSORS, LICENSEES, AFFILIATES, OR SUBSIDIARIES, OR ANY OF THEIR RESPECTIVE DIRECTORS, OFFICERS, EMPLOYEES, OR AGENTS, BE LIABLE TO THE CUSTOMER OR ANY THIRD PARTY FOR ANY INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE, EXEMPLARY, OR CONSEQUENTIAL DAMAGES OF ANY KIND WHATSOEVER, INCLUDING WITHOUT LIMITATION LOSS OF PROFITS, LOSS OF REVENUE, LOSS OF BUSINESS OPPORTUNITY, LOSS OF GOODWILL, BUSINESS INTERRUPTION OR LOSS, CORRUPTION, OR UNAVAILABILITY OF DATA, ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT OR THE SERVICES, WHETHER BASED ON CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY, MISREPRESENTATION, BREACH OF DUTY, BREACH OF STATUTORY DUTY, OR ANY OTHER LEGAL OR EQUITABLE BASIS, AND WHETHER OR NOT STRATUM HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES OR SUCH DAMAGES WERE REASONABLY FORESEEABLE. THESE EXCLUSIONS APPLY NOTWITHSTANDING ANY OTHER PROVISION OF THIS AGREEMENT, INCLUDING WITHOUT LIMITATION THE SERVICE STANDARDS, THE STANDARD OF CARE, AND THE PRIVACY OBLIGATIONS AS ALL SET OUT IN THIS AGREEMENT.",
        "items": []
      },
      {
        "heading": "Aggregate Cap.",
        "text": "Without limiting anything else contained herein, to the maximum extent permitted by applicable law, Stratum’s total cumulative liability to the Customer arising out of or relating to this Agreement, whether based on contract, tort, negligence, strict liability, misrepresentation, breach of duty, breach of statutory duty, or any other legal or equitable basis, shall not exceed THE GREATER OF: (A) the Total Monthly Service Plan FeeS actually paid by the Customer to Stratum under this Agreement during the three (3) months immediately before the event giving rise to the claim; and (b) three (3) times the Monthly service plan Fee in effect at the time of the Event giving rise to the Claim. This cap applies to all claims in aggregate, not per incident. The aggregate cap in this Section does not apply to liability arising from fraud or wilful misconduct.",
        "items": []
      },
      {
        "heading": "Customer’s Obligation to Insure.",
        "text": "The Customer acknowledges that the limitations and exclusions of liability set out in this Section reflect a commercial allocation of risk under which the Customer is responsible for maintaining adequate insurance coverage for its own losses, including without limitation cyber liability insurance, business interruption insurance, data loss insurance, and such other coverage as is appropriate for the Customer’s business and risk profile. Stratum’s pricing reflects this allocation of risk. The Customer agrees that it will not make any claim against Stratum for losses that are, or ought reasonably to be, covered by the Customer’s own insurance.",
        "items": []
      },
      {
        "heading": "Essential Basis.",
        "text": "THE CUSTOMER EXPRESSLY ACKNOWLEDGES THAT STRATUM IS MAKING THE SERVICES AVAILABLE IN RELIANCE ON THE LIMITATIONS AND EXCLUSIONS OF LIABILITY SET OUT IN THISAGREEMENT, AND THAT THOSE LIMITATIONS AND EXCLUSIONS FORM AN ESSENTIAL BASIS OF THE CONTRACT BETWEEN THE PARTIES. THE PARTIES ACKNOWLEDGE THAT THE FEES AND OTHER COMMERCIAL TERMS OF THIS AGREEMENT REFLECT THE ALLOCATION OF RISK SET OUT IN THIS AGREEMENT. The Customer expressly agrees that the limitations and exclusions of liability and the disclaimers set forth herein will survive, and continue to apply in the case of, a fundamental breach or breaches, the failure of essential purpose of contract, the failure of any exclusive remedy or the termination or suspension of the Customer’s use of, or access to, the Services.",
        "items": []
      },
      {
        "heading": "Statutory Liability.",
        "text": "Nothing in this Agreement limits liability that cannot be limited under applicable law.",
        "items": []
      }
    ]
  },
  {
    "id": "representations-and-warranties-of-the-customer",
    "title": "Representations And Warranties Of The Customer",
    "clauses": [
      {
        "heading": "Representations and Warranties.",
        "text": "The Customer represents and warrants to Stratum that:",
        "items": [
          {
            "text": "The Customer has full legal capacity, power, and authority to enter into this Agreement and to perform its obligations hereunder. If the Customer is a corporation or other legal entity, the individual executing this Agreement on the Customer’s behalf is duly authorized to do so and to bind the Customer. If the Customer is an individual, the Customer is of the age of majority in the jurisdiction in which the Customer is resident;",
            "items": []
          },
          {
            "text": "The execution, delivery, and performance of this Agreement by the Customer does not and will not conflict with or result in a breach of any other agreement, obligation, order, judgment, or law to which the Customer is a party or by which it is bound;",
            "items": []
          },
          {
            "text": "All hardware, software and other materials provided to Stratum by the Customer or the Customer’s employees, contractors or agents, or for which the Customer hires Stratum to provide the Services in relation to, do not infringe, and the providing of Services in relation thereto will not infringe, any existing third-party patent, trademark, trade secret, copyright or other intellectual property rights;",
            "items": []
          },
          {
            "text": "All information provided by the Customer to Stratum in connection with this Agreement, including information about the Customer’s technology environment, user count, device count, and business operations, is accurate and complete in all material respects as of the date of the Services Agreement. The Customer will promptly notify Stratum of any material change to such information that may affect the scope or delivery of the Services;",
            "items": []
          },
          {
            "text": "As of the date of Services Agreement, the Customer is not aware of any law, regulation, or order in any applicable jurisdiction that would prohibit or restrict the Customer’s access to or use of the Services;",
            "items": []
          },
          {
            "text": "As of the date of the Services Agreement, the Customer’s hardware and software environment meets, or the Customer will take all reasonable steps within a reasonable period of time following the execution of this Agreement, to bring it into compliance with the Minimum Requirements communicated by Stratum;",
            "items": []
          },
          {
            "text": "The Customer has the legal authority to provide Stratum with access to Customer Data, including any personal information contained therein.",
            "items": []
          }
        ]
      },
      {
        "heading": "Survival.",
        "text": "The representations and warranties set out in this Section will survive the execution of this Agreement and will be deemed to be repeated by the Customer on each day during the term of this Agreement. A breach of any representation or warranty in this Section will constitute a material breach of this Agreement.",
        "items": []
      }
    ]
  },
  {
    "id": "indemnity",
    "title": "Indemnity",
    "clauses": [
      {
        "heading": "Customer Indemnity.",
        "text": "THE CUSTOMER AGREES TO INDEMNIFY, DEFEND, AND SAVE HARMLESS STRATUM AND ITS DIRECTORS, OFFICERS, SUBCONTRACTORS, AND EMPLOYEES (collectively, the “Stratum Indemnitees”) FROM AND AGAINST ANY AND ALL THIRD-PARTY LOSSES, DAMAGES, LIABILITIES, OBLIGATIONS, SETTLEMENTS, JUDGMENTS, AND COSTS (INCLUDING WITHOUT LIMITATION LEGAL COSTS ON A SOLICITOR-AND-CLIENT BASIS) ARISING FROM OR IN CONNECTION WITH:",
        "items": [
          {
            "text": "the Customer’s data, content, materials, or systems, including any claim that Customer Data infringes a third party’s intellectual property rights or violates applicable privacy law;",
            "items": []
          },
          {
            "text": "the Customer’s misuse of the Services or use of the Services in violation of this Agreement, applicable law, or applicable Vendor Terms;",
            "items": []
          },
          {
            "text": "the Customer’s failure to implement Stratum’s reasonable security recommendations, maintain the Minimum Requirements, or meet its responsibilities under this Agreement; or",
            "items": []
          },
          {
            "text": "the Customer’s breach of any of its representations, warranties or covenants under this Agreement;",
            "items": []
          },
          {
            "text": "except to the extent directly caused by Stratum’s own negligence or wilful misconduct.",
            "items": []
          }
        ]
      },
      {
        "heading": "Indemnity Procedure.",
        "text": "The following procedure applies to any indemnity claim under this Section:",
        "items": [
          {
            "text": "Stratum will provide the Customer with written notice of any claim for which indemnification is sought as soon as reasonably practicable after Stratum becomes aware of the claim. Any failure or delay in giving notice will not relieve the Customer of its indemnity obligations except to the extent the Customer is materially prejudiced by the failure or delay.",
            "items": []
          },
          {
            "text": "The Customer may assume control of the defence of the claim at its expense, using counsel reasonably acceptable to Stratum. If the Customer assumes the defence, it will: keep Stratum fully informed of all material developments; allow Stratum to participate in the defence at Stratum’s own expense; pay all defence costs as incurred; and protect Stratum’s confidential information, systems, and regulatory posture throughout the defence.",
            "items": []
          },
          {
            "text": "Stratum may retain separate counsel at its own expense. If there is a conflict of interest between the parties, or if the Customer fails to assume the defence, Stratum may retain counsel at the Customer’s expense.",
            "items": []
          },
          {
            "text": "The Customer may not settle any indemnified claim without Stratum’s prior written consent (not to be unreasonably withheld or delayed) if the proposed settlement: admits fault or wrongdoing on Stratum’s part; imposes any monetary, operational, or non-monetary obligation on Stratum; restricts Stratum’s business, services, or practices; affects Stratum’s reputation or relationships with other clients; or does not include a full and unconditional release of Stratum.",
            "items": []
          },
          {
            "text": "The Customer may assume the defence only by written notice to Stratum confirming its indemnity obligation in respect of the claim, delivered no later than the earlier of:",
            "items": [
              "five (5) Business Days after receipt of Stratum’s notice; and",
              "five (5) Business Days before the date on which any response, defence, appearance, pleading, filing, hearing, application, or other procedural step is required in respect of the claim.",
              "If the Customer does not assume the defence within the period set out above, or if Stratum reasonably determines that immediate action is required to avoid default, preserve rights, comply with a deadline, seek an extension, or avoid material prejudice, Stratum may conduct the defence and take any related steps at the Customer’s expense, without limiting or waiving any right to indemnification. Any action taken by Stratum to protect its interests, comply with a deadline, avoid default, preserve evidence, or mitigate loss will not prejudice, limit, or waive Stratum’s rights under this Section."
            ]
          }
        ]
      },
      {
        "heading": "Injunctive Relief.",
        "text": "THE CUSTOMER ACKNOWLEDGES THAT A BREACH BY THE CUSTOMER OF THIS AGREEMENT MAY CAUSE STRATUM IRREPARABLE HARM FOR WHICH DAMAGES WOULD NOT BE AN ADEQUATE REMEDY AND, THEREFORE, AGREES THAT STRATUM WILL BE ENTITLED TO SEEK INJUNCTIVE OR OTHER EQUITABLE RELIEF AGAINST A CONTINUING OR FURTHER BREACH WITHOUT THE NECESSITY OF PROOF OF ACTUAL DAMAGES AND WITHOUT THE REQUIREMENT TO POST BOND OR OTHER SECURITY.",
        "items": []
      }
    ]
  },
  {
    "id": "confidentiality",
    "title": "Confidentiality",
    "clauses": [
      {
        "heading": "Confidential Information Defined.",
        "text": "As used in this Agreement, “Confidential Information” means all confidential or proprietary information disclosed by a party (the “Disclosing Party”) to the other party (the “Receiving Party”), whether disclosed orally, in writing, electronically, visually, or through access to systems, platforms, tools, or records, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure, including without limitation information disclosed before the date of the Services Agreement in connection with the parties’ evaluation of the engagement. Confidential Information includes, without limitation:",
        "items": [
          {
            "text": "in the case of the Customer: Customer Data, business data, files, records, credentials, system and network configurations, security architecture, vulnerability and incident reports, backup data, personal information, financial information, business plans, client and prospect information, and other information Stratum accesses in providing the Services; and",
            "items": []
          },
          {
            "text": "in the case of Stratum: Stratum IP (as hereinafter defined), pricing, proposals, service methodologies, technical documentation, runbooks, scripts, automation tools, monitoring methods, security processes, documentation structures, configurations, business methods, service delivery methods, and other proprietary know-how and materials developed by Stratum whether before or during the term of this Agreement.",
            "items": []
          }
        ]
      },
      {
        "heading": "Exclusions.",
        "text": "Confidential Information does not include information that:",
        "items": [
          {
            "text": "is or becomes generally known to the public without breach of any obligation owed to the Disclosing Party;",
            "items": []
          },
          {
            "text": "was known to the Receiving Party prior to its disclosure by the Disclosing Party without breach of any obligation owed to the Disclosing Party;",
            "items": []
          },
          {
            "text": "is received from a third party without breach of any obligation owed to the Disclosing Party; or",
            "items": []
          },
          {
            "text": "was independently developed by the Receiving Party without use of or reference to the Disclosing Party’s Confidential Information.",
            "items": []
          }
        ]
      },
      {
        "heading": "Obligations of Confidentiality.",
        "text": "Except as otherwise permitted in writing by the Disclosing Party, (i) Each Receiving Party will use the Disclosing Party’s Confidential Information only as reasonably required to perform, support, administer, secure or enforce this Agreement, (ii) Each Receiving Party shall use the same degree of care that it uses to protect the confidentiality of its own Confidential Information of like kind (but in no event less than reasonable care) not to disclose or use any Confidential Information of the Disclosing Party for any purpose outside the scope of this Agreement, and (iii) Each Receiving Party shall limit access to Confidential Information of the Disclosing Party to those of its employees, contractors and agents who need such access for purposes consistent with this Agreement and who have signed confidentiality agreements with the Receiving Party containing protections no less stringent than those herein.",
        "items": []
      },
      {
        "heading": "Compelled Disclosure.",
        "text": "The Receiving Party may disclose Confidential Information of the Disclosing Party if compelled by law, court order, regulator, or governmental authority to do so, provided that the Receiving Party:",
        "items": [
          {
            "text": "gives the Disclosing Party prior written notice of the compelled disclosure as soon as reasonably practicable and to the extent legally permitted;",
            "items": []
          },
          {
            "text": "provides reasonable assistance, at the Disclosing Party’s cost, if the Disclosing Party wishes to contest or seek protective treatment for the disclosure;",
            "items": []
          },
          {
            "text": "discloses only the minimum amount of Confidential Information legally required; and",
            "items": []
          },
          {
            "text": "if prior notice is legally prohibited, notifies the Disclosing Party as soon as legally permitted after the disclosure.",
            "items": []
          }
        ]
      },
      {
        "heading": "Return, Destruction and Retention.",
        "text": "Upon termination of this Agreement or upon written request by the Disclosing Party, the Receiving Party will promptly return or destroy the Disclosing Party’s Confidential Information in its possession, except that:",
        "items": [
          {
            "text": "the Receiving Party may retain copies required by applicable law, regulation, or professional obligation;",
            "items": []
          },
          {
            "text": "Stratum may retain Customer Confidential Information embedded in archival backups, ticketing systems, security logs, audit records, billing records, and other operational records that are not readily separable, until such records are overwritten or deleted in the ordinary course of Stratum’s record-keeping practices; and",
            "items": []
          },
          {
            "text": "any retained Confidential Information remains subject to the confidentiality obligations in this Section for so long as it is retained.",
            "items": []
          }
        ]
      },
      {
        "heading": "Injunctive Relief.",
        "text": "Each party acknowledges that a breach of this Section may cause the Disclosing Party irreparable harm for which damages would not be an adequate remedy, and that the Disclosing Party will be entitled to seek injunctive or other equitable relief against a continuing or further breach, without the necessity of proving actual damages or posting any bond or other security, in addition to all other rights and remedies available at law or in equity.",
        "items": []
      },
      {
        "heading": "Survival.",
        "text": "This Section will survive the expiration or termination of this Agreement.",
        "items": []
      }
    ]
  },
  {
    "id": "intellectual-property",
    "title": "Intellectual Property",
    "clauses": [
      {
        "heading": "Stratum’s Ownership.",
        "text": "Stratum retains all right, title, and interest in and to all intellectual property developed, created, conceived, or reduced to practice by Stratum, whether before or during the term of this Agreement, including without limitation tools, methods, templates, know-how, processes, scripts, automation, monitoring configurations, documentation structures, business methods, service delivery methods, improvements, enhancements, and materials, regardless of whether any such intellectual property was developed independently of the Customer, in the course of providing the Services, or using suggestions, feedback, or ideas provided by the Customer (collectively, “Stratum IP”). For greater certainty, any improvement, enhancement, or new development made by Stratum during the term of this Agreement, including any development that incorporates or is informed by suggestions or feedback provided by the Customer, forms part of Stratum IP and is owned solely by Stratum. No right, title, or interest in Stratum IP is transferred to the Customer by this Agreement, by the provision of the Services, or by the Customer’s provision of any suggestions or feedback. Disclosure of Confidential Information does not transfer ownership of or grant any licence to any intellectual property except as expressly set out in this Section. No ownership in Stratum IP is transferred unless expressly stated in a written agreement signed by both parties.",
        "items": []
      },
      {
        "heading": "Customer Licence to Deliverables.",
        "text": "Unless otherwise agreed in writing, where Stratum creates deliverables specifically for the Customer under this Agreement, the Customer receives a non-exclusive, non-transferable licence to use those deliverables for the Customer’s internal business purposes, after all Fees have been paid in full. For greater certainty:",
        "items": [
          {
            "text": "the licence granted under this Section in respect of deliverables for which all Fees have been paid in full will survive the termination of this Agreement; and",
            "items": []
          },
          {
            "text": "the licence does not extend to Stratum IP embedded in or underlying the deliverables, which remains owned by Stratum.",
            "items": []
          }
        ]
      },
      {
        "heading": "Service Documentation.",
        "text": "Stratum retains ownership of all Service Documentation. Upon termination of this Agreement and payment of all outstanding Fees, Stratum will, upon written request from the Customer made in accordance with this Agreement, provide the Customer with a copy of Service Documentation relating to the Customer’s systems and environment in a format reasonably accessible to the Customer. Time spent by Stratum in preparing and delivering such documentation will be billed as transition services.",
        "items": []
      },
      {
        "heading": "Customer IP.",
        "text": "The Customer retains all right, title, and interest in and to Customer Data and all other intellectual property owned by the Customer prior to or independently of this Agreement. Nothing in this Agreement transfers any Customer intellectual property to Stratum. Stratum’s right to access and use Customer Data is limited to the purposes set out in this Agreement.",
        "items": []
      }
    ]
  },
  {
    "id": "notice",
    "title": "Notice",
    "clauses": [
      {
        "heading": null,
        "text": "Any notice required or permitted to be given to any of the parties to this Agreement will be in writing and may be given by delivering, sending by e-mail, sending by courier service, or sending by prepaid registered mail posted in Canada, to the address or email address of such party first above stated or such other address or email address as any party may specify by notice in writing to the other parties. Any notice delivered, sent by e-mail, or couriered on a business day will be deemed conclusively to have been effectively given on the day the notice was delivered, or the e mail transmission was sent successfully to the e-mail address set out above, as the case may be.  Any notice sent by prepaid registered mail will be deemed conclusively to have been effectively given on the third business day after posting; but if at the time of posting or between the time of posting and the third business day thereafter there is a strike, lockout, or other labour disturbance affecting postal service, then the notice will not be effectively given until actually delivered.",
        "items": []
      }
    ]
  }
];
