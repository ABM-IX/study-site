/* Learn / Exam items. pts use "Head::Explanation". est = marks estimated (no past paper with this exact wording). */
var LEARN = [
/* ---------------- WINDOWS SERVER (Q1 compulsory) ---------------- */
{ id:"ws-install", t:"ws", tier:1, marks:5, steps:true,
  q:"Identify five significant steps involved in installing Windows Server 2019 using the graphical user interface (GUI).",
  seen:["2026 test","2025 test","2024 test","2024 final (2012 R2)","2023 test"],
  pts:[
    "Boot from the installation media::Insert the Windows Server 2019 DVD/USB (or attach the ISO to a VM), boot from it and press a key to start Setup.",
    "Choose language, time format and keyboard::Select them, click Next, then click Install now.",
    "Select the edition with Desktop Experience and accept the licence::For example “Windows Server 2019 Standard (Desktop Experience)”. Desktop Experience is the GUI option; Server Core has no GUI. Tick “I accept the license terms”.",
    "Choose “Custom: Install Windows only (advanced)”::This gives a clean installation. “Upgrade” would keep the old files and settings.",
    "Select, partition and format the drive::Pick the disk or partition (create/format it if needed) and click Next. Setup copies the files and restarts several times.",
    "Set the Administrator password and do initial configuration::Enter a strong password for the built-in Administrator, press Ctrl+Alt+Del to sign in. Server Manager opens: rename the server, give it a static IP and install updates."
  ],
  tip:"One step per mark, in order. Each step is the action plus a few words of detail. Writing “next, next, finish” scores nothing. For 4 marks, write steps 1, 3, 4 and 5." },

{ id:"ws-promote", t:"ws", tier:1, marks:5, steps:true,
  q:"You have just added AD DS on your server, but you receive a warning that says “The server is not yet running as a domain controller.” Which five steps would you use to promote a Windows Server 2012 R2 server to an AD DS domain controller?",
  seen:["2026 test","2025 test","2024 test","2022 test","2015 test & revision paper (as a command)"],
  pts:[
    "Open the notification flag::In Server Manager click the yellow warning triangle on the notifications flag, then click “Promote this server to a domain controller”. This starts the Active Directory Domain Services Configuration Wizard.",
    "Deployment configuration::Select “Add a new forest” and type the root domain name (for example finance.local). The other choices are adding a DC to an existing domain or adding a new domain to an existing forest.",
    "Domain Controller Options::Choose the forest and domain functional levels, keep DNS server and Global Catalog ticked, and type the Directory Services Restore Mode (DSRM) password.",
    "DNS options, NetBIOS name and paths::Click past the DNS delegation warning, confirm the NetBIOS domain name, and accept the default folders for the AD database, log files and SYSVOL.",
    "Review, prerequisites check, install::Review the options, let the prerequisites check pass and click Install. The server restarts automatically; you then log in as DOMAIN\\Administrator."
  ],
  tip:"Installing the role only copies the files; promotion creates the domain. On Server 2008 the answer is the command dcpromo (a 2-mark question on older papers). On 2012 R2 and 2019, dcpromo is replaced by this Server Manager wizard (or PowerShell Install-ADDSForest)." },

{ id:"ws-adds5", t:"ws", tier:1, marks:5, steps:true,
  q:"Identify five steps you would take to get Active Directory Domain Services (AD DS) working on Server 2012 R2. (Also asked as: set up a new AD DS forest on Windows Server 2019 using the GUI.)",
  seen:["2024 final","2023 test (Server 2019 forest)"],
  pts:[
    "Prepare the server::Give it a static IP address (pointing DNS to itself) and a proper computer name; a DC must not change address.",
    "Install the AD DS role::Server Manager → Manage → Add Roles and Features → Role-based installation → select the server → tick Active Directory Domain Services (add the required features) → Install.",
    "Promote the server::Click the notifications flag → “Promote this server to a domain controller”.",
    "Create the forest and domain::Choose “Add a new forest”, type the root domain name, set the functional levels, keep DNS and Global Catalog, set the DSRM password.",
    "Finish and verify::Confirm the NetBIOS name and paths, pass the prerequisites check, click Install, let it reboot, then log in as DOMAIN\\Administrator and check Active Directory Users and Computers and the DNS zones."
  ],
  tip:"This version starts one step earlier than the promote question: it includes installing the role." },

{ id:"ws-ou", t:"ws", tier:1, marks:2, steps:true,
  q:"Assuming the AD DS role is installed and the domain controller is powered on, write down the steps to create a new Organizational Unit (OU) called Finance.",
  seen:["2026 test","2025 test","2024 test (Marketing)","2024 final (Marketing)","2022 test (Marketing)","2015 test"],
  pts:[
    "Open Active Directory Users and Computers::Server Manager → Tools → Active Directory Users and Computers (or Run → dsa.msc).",
    "Create the OU::Right-click the domain name (for example company.local) → New → Organizational Unit.",
    "Name it::Type Finance (leave “Protect container from accidental deletion” ticked) → OK."
  ],
  tip:"Right-click the domain, not the Users container. Users is a built-in container, not an OU." },

{ id:"ws-group", t:"ws", tier:1, marks:2, steps:true,
  q:"Write down the steps to create a new group called Finance Juniors under the Finance OU.",
  seen:["2026 test","2025 test","2024 test (Sales under Marketing)","2022 test (Sales under Marketing)"],
  pts:[
    "Start a new group in the OU::In Active Directory Users and Computers, right-click the Finance OU → New → Group.",
    "Name it::Type the group name Finance Juniors.",
    "Choose scope and type::Group scope: Global; Group type: Security → OK."
  ],
  tip:"Mention scope and type. Security groups can be given permissions; distribution groups are for email only." },

{ id:"ws-adduser", t:"ws", tier:1, marks:2, steps:true,
  q:"Write down the steps to add an existing user called Mpho to the Finance Juniors group.",
  seen:["2026 test","2025 test","2022 test (Kim → Sales)","2015 test (Mpho → Bathusi, 4 marks)"],
  pts:[
    "Find the user::In Active Directory Users and Computers, locate Mpho (for example in the Users container), right-click → Add to a group… (or Properties → Member Of tab → Add).",
    "Pick the group::Type Finance Juniors → Check Names → OK.",
    "Confirm::Click OK / Apply. Alternative route: open the group → Properties → Members tab → Add → type Mpho → Check Names → OK."
  ],
  tip:"Either route earns the marks. Name the tab (Member Of or Members) and the Check Names step." },

{ id:"ws-newuser", t:"ws", tier:3, marks:3, steps:true,
  q:"The domain controller is on and Active Directory Users and Computers is open. Write down the steps to create a new user in the default Users container (or in an existing OU).",
  seen:["2017 supp","Revision paper (user in the Accounts OU, 4 marks)"],
  pts:[
    "Start a new user::Expand the domain, right-click the Users container (or the OU) → New → User.",
    "Enter the names::Type first name, last name and the user logon name (for example kim.m) → Next.",
    "Set the password::Type and confirm an initial password, tick “User must change password at next logon” → Next → Finish."
  ],
  tip:"" },

{ id:"ws-services", t:"ws", tier:1, marks:9, lect:true,
  q:"An organisation relies on several critical network services. (i) For each of DNS, DHCP and AD DS, describe its primary function. [3] (ii) For each, explain one specific problem the organisation would experience if that service became unavailable. [6]",
  seen:["2026 test","2025 test","2024 test","2022 test","2017 supp","Scenario revision"],
  pts:[
    "DNS: function::Resolves human-readable names (www.bac.ac.bw, fileserver01) into IP addresses, and IP addresses back into names. Active Directory also uses DNS (SRV records) so clients can find domain controllers.",
    "DNS unavailable::Users can't reach websites, file servers or email by name and would have to use IP addresses manually, which severely disrupts productivity. Domain logons also fail because clients can't locate the DC.",
    "DHCP: function::Automatically leases IP settings to clients from a scope: IP address, subnet mask, default gateway and DNS server. This avoids manual configuration and address conflicts.",
    "DHCP unavailable::New or rebooted devices can't get an address (they fall back to 169.254.x.x) so they can't join the network. Every machine would need manual IP configuration: slow, delayed and error-prone, with a risk of duplicate IPs.",
    "AD DS: function::A central directory database of users, computers and groups. It authenticates logons, authorises access to resources and lets admins manage accounts and Group Policy centrally (single sign-on).",
    "AD DS unavailable::Users can't log in or access shared files, email and other resources, and administrators lose the ability to manage user accounts and enforce security policies."
  ],
  tip:"Your lecturer read these answers out in the revision session and stressed: “You have to evaluate… a one-word answer is not an answer.” Each problem must say what breaks and how it affects the business." },

{ id:"ws-nodhcp", t:"ws", tier:2, marks:2,
  q:"Describe problems that might be encountered in a large network with more than 500 PCs without the use of DHCP.",
  seen:["2024 test (500 PCs)","2025 test (100 PCs)","2022 test (100 PCs)"],
  pts:[
    "Manual configuration of every PC::An admin must type the IP address, mask, gateway and DNS into each of 500 machines: very time-consuming, and new or moved machines wait for an admin before they can work.",
    "Errors and conflicts::Human error leads to duplicate IP addresses and wrong settings, causing connectivity failures that are hard to trace. Addresses are hard to track, reclaim and change (for example a new DNS server means visiting every PC)."
  ],
  tip:"" },

{ id:"ws-2019", t:"ws", tier:3, marks:3,
  q:"Explain one feature and one edition of Microsoft Windows Server 2019, and give an overview of the roles it offers. (Older form: suggest three server roles and explain their use.)",
  seen:["2023 test","2015 test (3 server roles, 6 marks)","Revision paper (3 roles)"],
  pts:[
    "Editions::Essentials (small businesses, up to 25 users / 50 devices); Standard (physical or lightly virtualised, 2 VMs per licence); Datacenter (highly virtualised data centres: unlimited VMs, Storage Spaces Direct, Shielded VMs, software-defined networking).",
    "Features::Windows Admin Center (browser-based management), System Insights (predictive analytics), Storage Migration Service, Shielded VMs, hybrid integration with Azure, Linux and Kubernetes container support.",
    "Roles::AD DS (directory and logons), DNS (name resolution), DHCP (automatic IP addressing), File and Storage Services (shared folders), Hyper-V (virtual machines), Web Server IIS (hosting websites), Print Services, Remote Desktop Services, WSUS (managing updates)."
  ],
  tip:"For “suggest three roles and explain their use”, give the role plus one sentence on what it does for the company." },

{ id:"ws-fileserver", t:"ws", tier:2, marks:6,
  q:"Discuss three advantages and three disadvantages of using Windows Server 2019 as a file server compared to cloud-based file storage. Consider scalability, security and cost.",
  seen:["2024 test","2023 test"],
  pts:[
    "Advantage: control and security of data::Data stays on your own premises under your own NTFS and AD permissions: good for confidentiality and regulatory compliance.",
    "Advantage: fast LAN access, no internet dependency::Files open at LAN speed and are still available when the internet link is down.",
    "Advantage: predictable cost and AD integration::A one-off hardware and licence purchase with no monthly per-user subscription; uses the existing AD accounts and groups.",
    "Disadvantage: high upfront cost::Server hardware, Windows Server licences and CALs, backup system, power and cooling all cost money before you start (capital expense).",
    "Disadvantage: limited scalability::More space means buying and installing more disks or servers; cloud storage scales on demand (elasticity).",
    "Disadvantage: maintenance and disaster risk::You must patch, back up and repair it yourself. A fire or theft at one site can lose data unless backups are kept off-site, and remote access needs a VPN, whereas cloud storage is reachable anywhere."
  ],
  tip:"Use the three factors the question names (scalability, security, cost) as your headings." },

{ id:"ws-share", t:"ws", tier:3, marks:5, steps:true,
  q:"Create a new file share named “Marketing Docs” on Windows Server 2019 with specific permissions, using the GUI. Explain why you chose those permissions.",
  seen:["2023 test"],
  pts:[
    "Create the folder::For example D:\\Marketing Docs.",
    "Start the New Share wizard::Server Manager → File and Storage Services → Shares → Tasks → New Share → SMB Share – Quick → select the folder.",
    "Name and settings::Share name: Marketing Docs; optionally enable access-based enumeration (users only see what they can open).",
    "Set permissions::Customize permissions: remove Everyone; add the Marketing group with Modify; give Administrators Full Control → Create. (Alternative: right-click the folder → Properties → Sharing → Advanced Sharing, plus the Security tab for NTFS.)",
    "Why::Principle of least privilege: Marketing staff can read and edit their documents but can't change permissions, other departments can't see confidential marketing files, and admins keep full control to manage the share."
  ],
  tip:"" },

{ id:"ws-help", t:"ws", tier:3, marks:2,
  q:"Kim wants a help desk that can only reset user account passwords, but must not be able to create new user accounts. What does she need to do?",
  seen:["2022 test","2017 supp"],
  pts:[
    "Use the Delegation of Control Wizard::In Active Directory Users and Computers, right-click the domain or the OU holding the users → Delegate Control → add the help-desk group.",
    "Delegate only the password task::Tick only “Reset user passwords and force password change at next logon” (not “Create, delete and manage user accounts”) → Finish."
  ],
  tip:"Don't say “add them to Domain Admins” or “Account Operators”: both give far more rights than needed." },

{ id:"ws-scopes", t:"ws", tier:3, marks:5,
  q:"Differentiate between the domain local and global group scopes [2]. Kim wants to convert a global group to a domain local group. Write down the steps [3].",
  seen:["2017 supp"],
  pts:[
    "Global::Members come only from its own domain, but it can be given permissions to resources in any domain in the forest. Used to gather users by role (for example Sales staff).",
    "Domain local::Members can come from any domain in the forest (users, global and universal groups), but it can only be given permissions to resources in its own domain. Used to grant access to a resource.",
    "Conversion rule::A global group can't be changed directly to domain local; it must go through universal.",
    "Steps::In Active Directory Users and Computers, right-click the group → Properties → General tab → Group scope: Universal → Apply; then select Domain local → OK."
  ],
  tip:"Memory hook: Global gathers users; Domain local grants permissions. Scope (domain local, global, universal) is different from type (security, distribution)." },

{ id:"ws-mmc", t:"ws", tier:3, marks:4,
  q:"Your boss wants you to create, manage and distribute Microsoft Management Console (MMC) consoles. Write the command to create an MMC [1], explain its advantage [1–2], and give the first two steps to add Active Directory Users and Computers to a new empty MMC [2].",
  seen:["2017 supp","Revision paper"],
  pts:[
    "Command::Run → mmc (mmc.exe) opens an empty console.",
    "Advantage::You build one custom console holding only the snap-ins you need (ADUC, DNS, DHCP…), save it as a .msc file and give it to other admins: consistent, centralised administration from one window.",
    "Add the snap-in::File → Add/Remove Snap-in → select Active Directory Users and Computers → Add → OK (then File → Save)."
  ],
  tip:"" },

{ id:"ws-terms", t:"ws", tier:3, marks:6,
  q:"Explain the following terms as used in Windows Server: Active Directory, domain, tree, forest, Organizational Unit, functional level.",
  seen:["2017 supp","2015 test","Revision paper"],
  pts:[
    "Active Directory::Microsoft's directory service: a hierarchical database of network objects (users, computers, groups) giving centralised authentication, authorisation and management.",
    "Domain::A logical group of users, computers and resources sharing one AD database, one set of security policies and a common name (for example bac.ac.bw). The core unit of administration.",
    "Tree::One or more domains sharing a contiguous DNS namespace and joined by automatic two-way transitive trusts (for example bac.ac.bw and fin.bac.ac.bw).",
    "Forest::One or more trees sharing a common schema, configuration and global catalog: the outermost security boundary. The first domain created is the forest root.",
    "Organizational Unit::A container inside a domain used to organise users, groups and computers (for example by department) so you can delegate administration and apply Group Policy.",
    "Functional level::A setting that decides which AD DS features are available, based on the oldest Windows Server version allowed to run as a DC in that domain or forest."
  ],
  tip:"2 marks each: a definition plus an example or purpose." },

{ id:"ws-clientserver", t:"ws", tier:3, marks:3,
  q:"State two advantages of a client-server network compared to peer-to-peer [2]. Why would a server have a static IP address instead of a dynamically assigned one? [1]",
  seen:["2017 supp","2015 test"],
  pts:[
    "Centralised administration::Users, security and resources are managed in one place on the server instead of on every PC.",
    "Centralised security and backup::One login per user (AD), consistent permissions, and data backed up centrally. It also scales: peer-to-peer becomes unmanageable beyond about 10 PCs.",
    "Static IP for servers::Clients, DNS records, mapped drives and other services must always find the server at the same address; if DHCP changed it, clients would lose access."
  ],
  tip:"" },

{ id:"ws-vbox", t:"ws", tier:3, marks:4, steps:true,
  q:"Describe the process of creating a Windows Server 2012 R2 virtual machine using Oracle VirtualBox.",
  seen:["2022 test"],
  pts:[
    "New VM::Open VirtualBox → New → enter a name, Type: Microsoft Windows, Version: Windows 2012 (64-bit).",
    "Memory and CPU::Allocate RAM (2048 MB or more) and processors.",
    "Virtual disk::Create a virtual hard disk now → VDI, dynamically allocated, about 40 GB.",
    "Attach the ISO and network::Settings → Storage → attach the Server 2012 R2 ISO to the optical drive; Network → NAT, Bridged or Internal.",
    "Start and install::Start the VM; it boots from the ISO and you install Windows Server as normal."
  ],
  tip:"VirtualBox is a Type 2 (hosted) hypervisor, which links to the virtualisation topic." },

/* ---------------- SYSADMIN ROLES ---------------- */
{ id:"ad-resp", t:"admin", tier:2, marks:6,
  q:"A company employs a Network Administrator, a Database Administrator and a System Administrator. List two primary responsibilities of each.",
  seen:["2025 test"],
  pts:[
    "Network Administrator::Configures and maintains routers, switches, firewalls, Wi-Fi and VPNs; monitors network performance and troubleshoots connectivity (IP addressing, VLANs).",
    "Database Administrator::Installs and maintains the DBMS and schedules database backups and recovery; tunes performance and controls who can access which data (integrity and security).",
    "System Administrator::Installs, configures and patches servers and operating systems; manages user accounts, groups and permissions (AD) and runs backups and restores."
  ],
  tip:"Two separate responsibilities per role, each starting with a verb." },

{ id:"ad-oneperson", t:"admin", tier:2, marks:8,
  q:"You are the only IT employee in a growing 50-person company (customer database, file sharing, email, e-commerce site). The CEO wants to keep the “one person does everything” model. Evaluate two advantages and two disadvantages [4], then conclude whether it is sustainable, with two clear reasons [4].",
  seen:["2026 test"],
  pts:[
    "Advantage: lower cost::One salary instead of three, which matters for a small company with a tight budget.",
    "Advantage: simple communication and a full picture::One person understands how the database, servers and network fit together, so problems are diagnosed quickly with no hand-offs between teams.",
    "Disadvantage: single point of failure::If that person is sick, on leave or resigns, nobody else can run or recover the systems; critical knowledge walks out with them.",
    "Disadvantage: overload and no separation of duties::As the company grows the workload outgrows one person, leading to burnout, mistakes and skipped tasks (backups, patches). One person holding every password is also a security risk because nobody checks their work.",
    "Conclusion::Not sustainable for a growing company. It works today, but not as the business grows.",
    "Reason 1::Workload and complexity grow with users and transactions; one person can't keep an e-commerce site, customer database and network all secure, patched and backed up.",
    "Reason 2::The business can't afford total dependence on one person. Specialists (DBA, security, network) give depth, cover for each other and separation of duties."
  ],
  tip:"“Evaluate” means both sides plus a verdict. The conclusion needs two new reasons, not a repeat of the disadvantages." },

{ id:"ad-docs", t:"admin", tier:2, marks:4,
  q:"A highly skilled senior administrator refuses to document configurations, network maps or password changes: “I know all these systems by heart.” Construct a convincing argument (two points) for why documentation is non-negotiable.",
  seen:["2026 test"],
  pts:[
    "Business continuity::If he's sick, leaves or can't be reached during an outage, others can restore and run the systems from the documentation. Without it the company depends entirely on one person's memory.",
    "Faster troubleshooting and recovery::Network maps and configuration records let anyone find a fault or rebuild a server quickly, which cuts downtime and cost.",
    "Security, audit and compliance::Recorded password and configuration changes create accountability and are required by auditors (for example PCI DSS); undocumented changes can hide mistakes or misuse.",
    "Change management and onboarding::New staff learn the systems faster, and planned changes can be checked against the current configuration so they don't break something."
  ],
  tip:"2 points × 2 marks: state the point, then its consequence for the business." },

{ id:"ad-hire", t:"admin", tier:2, marks:5,
  q:"Your fast-growing e-commerce company stores millions of customer credit card numbers. You can hire one specialist: a Database Administrator or a Security Administrator. Which is more critical to hire first? Justify with two business-focused reasons.",
  seen:["2026 test"],
  pts:[
    "Choice::Hire the Security Administrator first.",
    "Reason 1: legal and financial risk::Storing card numbers requires PCI DSS compliance. A breach brings heavy fines and lawsuits, and the company can lose the right to take card payments.",
    "Reason 2: customer trust and revenue::An online shop runs on trust. A publicised breach drives customers away and could end the business, and an internet-facing site is attacked constantly, so firewalls, encryption, monitoring and patching can't wait.",
    "Why not the DBA first::Database performance problems cost some speed; a security breach can cost the whole company. The existing admin can keep the database running meanwhile."
  ],
  tip:"Marks are for business reasons: money, legal risk, reputation, continuity. A well-argued DBA answer could score, but security is the easier case here." },

{ id:"ad-nonhw", t:"admin", tier:3, marks:10,
  q:"The systems administrator's role isn't confined to hardware and software. Identify two major roles not directly related to hardware/software [2], explain what each involves [4] and justify its importance [4].",
  seen:["2014 final"],
  pts:[
    "User support and training::Helping users and running awareness training (passwords, phishing, scanning USB drives). Important because many faults and most breaches start with users; trained users make fewer mistakes.",
    "Security policy and compliance::Writing and enforcing acceptable-use, password and backup policies. Important because it protects data and keeps the organisation within the law.",
    "Documentation and planning::Recording configurations, capacity planning and budgeting for upgrades. Important because it allows growth without surprises and recovery after failures.",
    "Backup and disaster-recovery planning::Planning and testing how systems come back after failure or attack. Important because the business can keep running after a disaster."
  ],
  tip:"" },

{ id:"ad-nos", t:"admin", tier:3, marks:5,
  q:"Explain five services offered by a Network Operating System (NOS).",
  seen:["2014 final"],
  pts:[
    "File and print sharing::Users share folders and printers across the network.",
    "User account management and authentication::Central accounts and logons (for example AD).",
    "Directory services::A database of network objects so users and resources can be found and managed.",
    "Security and access control::Permissions decide who can use which resource.",
    "Network management and monitoring::Tools to watch performance and manage devices.",
    "Backup, remote access and application services::Central backup, VPN/remote desktop, web and email services."
  ],
  tip:"" },

/* ---------------- ETHERNET FUNDAMENTALS ---------------- */
{ id:"eth-success", t:"eth", tier:2, marks:6,
  q:"Explain three key factors that have contributed to the success and widespread adoption of Ethernet as the dominant LAN technology.",
  seen:["2026 test","2025 test (scenario)","2024 test"],
  pts:[
    "Simplicity and ease of maintenance::Easy to install, configure and troubleshoot with little technical overhead, so small IT teams can run it.",
    "Low cost of installation and upgrade::Cheap NICs, switches and cabling; economical to scale and maintain, which suits a cost-conscious company.",
    "Reliability::Proven performance with robust error detection (FCS) and stable transmission.",
    "Ability to incorporate new technologies::It kept absorbing faster speeds and new media (10 Mbps → 100 Mbps → 1 Gbps → 10 Gbps, copper and fibre).",
    "Scalability::Grows from a small office to enterprise and data-centre networks.",
    "Interoperability::Based on the IEEE 802.3 standard, so equipment from different vendors works together.",
    "Versatility and continuous evolution::Runs over copper or fibre, carries voice, video and data, and now extends to MANs and WANs."
  ],
  tip:"6 marks for 3 factors means 2 marks each: name the factor and explain why it made organisations choose Ethernet. In the 2025 scenario, link each factor back to “reliable and cost-effective”." },

{ id:"eth-mac", t:"eth", tier:2, marks:5,
  q:"Explain the difference between deterministic and non-deterministic media access control (MAC) methods. Provide one example of each.",
  seen:["2026 test"],
  pts:[
    "Deterministic (“taking turns”)::Each station gets access in a fixed, predictable order, usually by holding a token. There are no collisions and the access time is guaranteed.",
    "Deterministic example::Token Ring (logical ring, physical star) or FDDI (dual ring), both using token passing.",
    "Non-deterministic (“first come, first served”)::Stations contend for the medium whenever it is free. Collisions can happen and access time isn't guaranteed.",
    "Non-deterministic example::Ethernet using CSMA/CD (wireless uses CSMA/CA).",
    "The trade-off::Deterministic is predictable and collision-free but has token overhead; non-deterministic is simple and efficient at light load, but performance drops as collisions increase."
  ],
  tip:"" },

{ id:"eth-naming", t:"eth", tier:2, marks:3,
  q:"Explain the naming convention used for Ethernet cables. Using 1000BASE-T as an example, describe what 1000, BASE and T represent.",
  seen:["2025 test"],
  pts:[
    "1000::The speed: 1000 Mbps (1 Gbps).",
    "BASE::Baseband signalling: the entire bandwidth of the medium carries one signal at a time. (BROAD would mean broadband: several channels on one medium.)",
    "T::The medium: twisted-pair copper cable. Other suffixes: SX = short-wavelength fibre, LX = long-wavelength fibre, 2 = thin coaxial cable."
  ],
  tip:"" },

{ id:"eth-ifs", t:"eth", tier:2, marks:4,
  q:"Describe how interframe spacing and the backoff algorithm help manage data transmission in Ethernet networks.",
  seen:["2025 test","2015 test & revision paper (exponential backoff, 10 marks)"],
  pts:[
    "Interframe spacing::The minimum gap between two frames, measured from the last bit of one frame's FCS to the first bit of the next frame's preamble.",
    "How long::96 bit-times (9.6 µs on 10 Mbps Ethernet). Faster Ethernet still uses 96 bit-times, which is shorter in real time.",
    "Why it helps::It gives slower devices time to process a frame before the next arrives, keeping transmission orderly.",
    "Backoff algorithm::After a collision every station waits for the medium to go idle (the full interframe spacing); the stations that collided then wait an extra random time before retransmitting.",
    "Why random and growing::So the colliding stations don't retry at the same moment and collide again. After repeated collisions the random range doubles (truncated binary exponential backoff), spreading the retries out."
  ],
  tip:"Interframe spacing happens between every frame; backoff only happens after a collision." },

{ id:"eth-frame", t:"eth", tier:3, marks:6,
  q:"Describe three main components of an Ethernet frame.",
  seen:["2024 test"],
  pts:[
    "Preamble and SFD (8 bytes)::7 bytes of alternating 1s and 0s synchronise the receiver's clock; the Start Frame Delimiter (10101011) marks where the frame begins.",
    "Destination MAC address (6 bytes)::The 48-bit hardware address of the receiving NIC (or the broadcast FF-FF-FF-FF-FF-FF).",
    "Source MAC address (6 bytes)::The 48-bit burned-in address of the sending NIC.",
    "Length/Type (2 bytes)::Either the length of the data (IEEE 802.3) or the upper-layer protocol carried, for example 0x0800 = IPv4.",
    "Data and pad (46–1500 bytes)::The encapsulated packet, padded so the frame reaches the 64-byte minimum.",
    "Frame Check Sequence (4 bytes)::A CRC-32 checksum the receiver recalculates to detect corrupted frames."
  ],
  tip:"" },

{ id:"eth-errors", t:"eth", tier:3, marks:3,
  q:"Outline three sources of Ethernet errors.",
  seen:["2024 test"],
  pts:[
    "Collisions and runts::Two devices transmit at once on a shared segment; the result is a collision fragment or runt (a frame under 64 bytes).",
    "Late collisions::A collision after the first 64 bytes (slot time), usually from cables that are too long or a duplex mismatch.",
    "Jabber / long frames::A frame longer than the maximum, usually from a faulty NIC or driver.",
    "FCS and alignment errors::Noise, EMI or a damaged cable corrupts bits, so the checksum fails or the frame has missing or extra bits."
  ],
  tip:"" },

{ id:"eth-cdca", t:"eth", tier:2, marks:8,
  q:"Clearly explain the differences in the application of CSMA/CD and CSMA/CA, giving reasons why each access mechanism suits the type of LAN (wired or wireless) where it is used.",
  seen:["2024 test","2015 test (why CSMA/CD suits wired, 4 marks)"],
  pts:[
    "CSMA/CD in wired LANs::A station listens to the cable (carrier sense). If it is idle it transmits while still listening; if it detects a collision it sends a jam signal, stops, waits a random backoff time and retries.",
    "Why CD suits wired::A wired NIC can transmit and receive at the same time, so it can detect a collision during its own transmission, quickly and cheaply.",
    "CSMA/CA in WLANs::A station listens; if the channel is idle it waits a random time, sends RTS, waits for CTS, transmits, and expects an ACK for every frame. No ACK means it assumes a collision and starts again.",
    "Why CA suits wireless::Radios are half-duplex: a station can't hear while it is sending, and because of hidden nodes it can't hear every other station anyway. Collisions can't be detected, so they must be avoided.",
    "Note::Modern switched, full-duplex Ethernet has no collisions at all; CSMA/CD only matters in half-duplex."
  ],
  tip:"" },

/* ---------------- GIGABIT ETHERNET ---------------- */
{ id:"gbe-sublayers", t:"gbe", tier:1, marks:6,
  q:"From your knowledge of the Gigabit Ethernet architecture, justify the need for (or differentiate the functions of) the Physical Coding Sublayer (PCS), Physical Medium Attachment (PMA) and Physical Medium Dependent (PMD) sublayers.",
  seen:["2026 test","2025 test","2024 test (PMA + PCS)","2022 test","2020 final","2017 supp","2015 test","2014 final","Revision paper"],
  pts:[
    "PCS: Physical Coding Sublayer::Takes the 8-bit octets passed down by the GMII and encodes them into 10-bit code groups using 8B/10B coding, borrowed from Fibre Channel.",
    "Why PCS is needed::8B/10B produces a DC-balanced signal that improves error detection, bit synchronisation and clock recovery at 1 Gbps. Fibre transmission depends on this coding.",
    "PMA: Physical Medium Attachment (serializer/deserializer)::Converts the parallel 10-bit code groups into a serial bit stream for the PMD, and on receive turns the serial bits back into code groups for the PCS. It supports multiple encoding schemes for the layers above.",
    "Why PMA is needed::The medium carries one bit at a time, so the code groups must be serialised (and the receive clock recovered) before they can be sent.",
    "PMD: Physical Medium Dependent::Maps the physical medium to the PCS: converts the serial bits into light pulses on fibre (1000BASE-SX/LX) or electrical impulses on copper, and defines the signalling for each medium.",
    "Why PMD is needed::Each medium (multimode fibre, single-mode fibre, copper) needs different signalling. Keeping that in one sublayer makes everything above it media independent."
  ],
  tip:"“Justify” means say why each one is needed, not only what it does. Going down the stack: Code → Serialise → Signal (PCS → PMA → PMD). Your lecturer: “Go again for the description of all of this. You will get your two marks for each.”" },

{ id:"gbe-media", t:"gbe", tier:1, marks:9,
  q:"Gigabit Ethernet (IEEE 802.3z) has three media connectivity options: 1000BASE-SX, 1000BASE-LX and 1000BASE-CX. Describe each (medium, distance, usage) and the setup where each is most suitable.",
  seen:["2024 test","2022 test","2017 supp","2015 test","2014 final","Revision paper","2026 test (as scenarios)"],
  pts:[
    "1000BASE-SX: medium and distance::Short-wave 850 nm laser over multimode fibre (62.5 or 50 µm), about 220–550 m. The cheapest fibre option.",
    "SX: best setup::Short fibre runs inside a building, such as a floor-to-floor backbone or links between switches in one LAN.",
    "1000BASE-LX: medium and distance::Long-wave 1300 nm laser over single-mode fibre (up to 5 km in the standard, 10 km with long-haul GBICs) or multimode (about 550 m). More expensive.",
    "LX: best setup::Campus backbones between buildings that are several kilometres apart.",
    "1000BASE-CX: medium and distance::Special shielded, balanced 150-ohm copper cable with a DB-9 connector, up to 25 m.",
    "CX: best setup::Short-haul links in a data centre or wiring closet: switch-to-switch and inter- or intra-rack connections. It can't reach riser closets beyond 25 m."
  ],
  tip:"For 9 marks: medium + distance + usage for each (3 × 3). Your lecturer: SX's maximum is about 550 m, “so it doesn't span over kilometres. That's why you were restricted to use LX.”" },

{ id:"gbe-sxlx", t:"gbe", tier:1, marks:2,
  q:"A university wants to connect two buildings several kilometres apart. The administrator must choose between 1000BASE-SX and 1000BASE-LX. Which is more appropriate and why?",
  seen:["2026 test"],
  pts:[
    "Choose 1000BASE-LX::Its long-wave (1300 nm) laser over single-mode fibre reaches up to 5 km (10 km with LH GBICs), covering several kilometres.",
    "Why not SX::SX's short-wave laser on multimode fibre only reaches about 220–550 m, far short of the distance between the buildings."
  ],
  tip:"1 mark for the choice, 1 for the distance reason." },

{ id:"gbe-cx", t:"gbe", tier:1, marks:2,
  q:"An organisation plans a 20-metre high-speed connection between devices inside a data centre. The administrator proposes 1000BASE-CX. Evaluate this choice.",
  seen:["2026 test"],
  pts:[
    "Appropriate::20 m is within CX's 25 m limit, and CX was designed exactly for short data-centre interconnects (switch-to-switch, inter-rack) over shielded copper: cheap, with no optics needed.",
    "Caution::There's no room to grow beyond 25 m and it needs special shielded 150-ohm cable. If the devices may move further apart, fibre (SX) or 1000BASE-T (up to 100 m) is safer."
  ],
  tip:"“Evaluate” = judgement + reason. Your lecturer: “20 metres was given… you should have known that this is where CX is. It goes up to 25 metres.”" },

{ id:"gbe-gbic", t:"gbe", tier:1, marks:2,
  q:"A network manager wants to upgrade several switches while keeping the network operational, using Gigabit Interface Converter (GBIC) modules instead of replacing the switches. Evaluate the proposal.",
  seen:["2026 test"],
  pts:[
    "Good proposal::GBICs are hot-swappable, so modules can be inserted or removed without powering the switch down and the network stays up. Each port can be set for SX, LX, LH or copper, and it costs far less than replacing the switches.",
    "Condition::It only works if the switches have GBIC slots and compatible modules; a Gigabit switch without GBIC ports can't support other lasers."
  ],
  tip:"" },

{ id:"gbe-dmd", t:"gbe", tier:1, marks:4,
  q:"A company reports poor Gigabit Ethernet performance on a multimode fibre link using an LX laser. Propose a solution and explain how it addresses the problem. (Also asked: explain the DMD problem and which mode of fibre it affects.)",
  seen:["2026 test","2025 test (2 marks)","2015 test","2014 final","Revision paper"],
  pts:[
    "The cause: Differential Mode Delay (DMD)::Multimode fibre carries light in many modes (paths) at once. When a long-wave LX/LH laser (1300 nm) is launched into the centre of the core, the modes travel at different speeds and arrive at different times.",
    "The effect::The pulses spread out, causing inter-symbol interference, jitter and bit errors. One mode can even split into two or more, causing data loss and limiting the distance.",
    "Which fibre::Only multimode fibre, and only with LX/LH lasers. Single-mode fibre has one mode, so it has no DMD.",
    "Solution: mode conditioning patch cable::Fit one between the LX transceiver and the multimode cable plant.",
    "How it fixes it::It offsets the laser launch away from the centre of the core (a “conditioned launch”), so the light isn't concentrated in the centre and the modes behave consistently, minimising DMD."
  ],
  tip:"For the 4-mark scenario: name the solution, say where it goes, and explain how it stops DMD. Your lecturer: “refer to the differential mode delay… solved through the mode conditioning patch cable… to offset data from running through the centre.”" },

{ id:"gbe-lasers", t:"gbe", tier:2, marks:4,
  q:"What are the two key differences between long-wave and short-wave laser technologies in fibre-optic Ethernet?",
  seen:["2025 test"],
  pts:[
    "Distance::Short-wave (850 nm, SX) travels shorter distances (about 220–550 m on multimode); long-wave (1300 nm, LX) travels much further (5–10 km on single-mode).",
    "Cost::Short-wave lasers are cheaper; long-wave lasers are more expensive.",
    "Fibre support (extra)::Short-wave works only over multimode; long-wave works over single-mode (it's optimised for it) and over multimode.",
    "Multimode sizes (extra)::50 µm multimode has higher modal bandwidth than 62.5 µm, so short-wave lasers reach further on 50 µm."
  ],
  tip:"The slide says it directly: “The key differences between the use of long- and short-wave laser technologies are cost and distance.”" },

{ id:"gbe-duplex", t:"gbe", tier:2, marks:4,
  q:"One of the changes made in the MAC sublayer was the switch to full-duplex mode. Discuss the impact of this change on Gigabit Ethernet.",
  seen:["2022 test","2020 final (2 marks)","2017 supp","2015 test","Revision paper"],
  pts:[
    "Send and receive at the same time::Separate transmit and receive paths double the effective capacity to 2 Gbps aggregate per link.",
    "No collisions::On a dedicated full-duplex switch port there are no collisions, so CSMA/CD isn't needed.",
    "Distance no longer limited by collision timing::In half-duplex GbE the network diameter is limited (carrier extension stretches the slot time to 512 bytes); in full duplex the distance is limited only by the medium.",
    "Lower latency and flow control::No backoff delays; 802.3x PAUSE frames manage congestion instead."
  ],
  tip:"" },

{ id:"gbe-frame", t:"gbe", tier:2, marks:2,
  q:"Explain why the Gigabit Ethernet frame format and the Ethernet frame format are exactly the same.",
  seen:["2022 test","2017 supp","2015 test","2014 final (3 marks)","Revision paper"],
  pts:[
    "Same MAC and frame::GbE keeps the IEEE 802.3 frame (preamble, MAC addresses, type/length, data, FCS) and the same 64–1518 byte frame sizes.",
    "Why: backward compatibility::It works with the huge installed base of 10/100 Mbps Ethernet. Frames move between Ethernet, Fast Ethernet and GbE with no frame translation, so existing NICs, switches, tools and staff knowledge keep working, which makes migration easy."
  ],
  tip:"Only difference (2014 version): in half-duplex, carrier extension pads short frames to a 512-byte slot time." },

{ id:"gbe-reasons", t:"gbe", tier:2, marks:6,
  q:"The original Ethernet was defined by IEEE as 802.3. Give four to six reasons (drivers) that led many organisations to switch to Gigabit Ethernet (IEEE 802.3z).",
  seen:["2022 test (6)","2017 supp (4)","2015 test (4)","2014 final (5)","Revision paper (4)"],
  pts:[
    "Higher speed::1000 Mbps, ten times Fast Ethernet, for video, web applications, large data and growing internet use.",
    "Backward compatibility::Works alongside existing 10/100 Mbps Ethernet, so organisations can upgrade gradually without replacing everything.",
    "Standardised and widely supported::Based on IEEE 802.3, so equipment from different vendors works together.",
    "Scalable design::Suits small LANs as well as enterprise backbones and data centres.",
    "Multiple media types::Copper (1000BASE-T, CX) and fibre (SX, LX) to suit the distance and budget.",
    "Low latency, full duplex::Full-duplex operation eliminates collisions and reduces delays.",
    "Simplified management::Same Ethernet tools and knowledge, so existing skills and hardware are reused."
  ],
  tip:"These are the slide's seven advantages. Your lecturer: “all the reasons are given, one to six, I think, in your slides.”" },

{ id:"gbe-gmii", t:"gbe", tier:3, marks:4,
  q:"If you remove the Gigabit Media Independent Interface (GMII), what characteristics of Gigabit Ethernet will be lost?",
  seen:["2014 final"],
  pts:[
    "Media independence::GMII is the interface that lets any physical layer be used by the MAC. Without it the MAC is tied to one PHY and medium.",
    "Wide data paths::GMII provides independent 8-bit-wide transmit and receive paths needed to reach 1 Gbps.",
    "Duplex support::It supports both half-duplex and full-duplex operation.",
    "Control and management::It carries four groups of signals: transmit, receive, Ethernet control and management signals."
  ],
  tip:"Related: the Reconciliation Sublayer maps PHY primitives to GMII signals; the MDI is the actual connector." },

{ id:"gbe-vsfast", t:"gbe", tier:3, marks:3,
  q:"What is Gigabit Ethernet, and how does it differ from Fast Ethernet?",
  seen:["2024 test"],
  pts:[
    "What it is::IEEE 802.3z (fibre and CX) / 802.3ab (copper) Ethernet at 1000 Mbps, used for backbones and server connections; it combines 802.3 Ethernet with Fibre Channel physical-layer technology.",
    "Speed::Ten times Fast Ethernet (802.3u, 100 Mbps).",
    "Physical layer::Uses Fibre Channel's 8B/10B coding (PCS) and the GMII instead of the MII; mainly fibre (SX/LX) plus copper. Half-duplex GbE adds carrier extension and frame bursting. The frame format and MAC are unchanged."
  ],
  tip:"" },

{ id:"gbe-fabric", t:"gbe", tier:3, marks:3,
  q:"What is the goal of an Ethernet fabric?",
  seen:["2020 final"],
  pts:[
    "One flat logical switch::Make the data-centre network behave like one large, flat, logical switch with any-to-any connectivity.",
    "Multiple active paths::All links carry traffic (no links blocked by spanning tree), giving high bandwidth and low latency for East-West traffic between servers.",
    "Simpler management and resilience::Managed as a single unit; a failed link or switch is routed around automatically. Spine-leaf is a common fabric design."
  ],
  tip:"" },

/* ---------------- WIRELESS ---------------- */
{ id:"wifi-advdis", t:"wifi", tier:2, marks:4,
  q:"A university is deciding between a wired and a wireless network for students. Analyse two (or three) advantages and two (or three) disadvantages of a wireless network that might influence this decision.",
  seen:["2026 test","2025 test (6 marks)"],
  pts:[
    "Advantage: mobility::Students stay connected moving between lecture halls, the library and residences, working from anywhere on campus.",
    "Advantage: quick, cheap installation::No cables to run to every seat, which is ideal for old buildings and open areas.",
    "Advantage: scalability::New students join just by connecting to existing access points, with no new cable runs as numbers grow.",
    "Disadvantage: security::The signal goes beyond the walls, so anyone in range can try to intercept traffic or set up a rogue AP; it needs WPA2/WPA3-Enterprise and monitoring.",
    "Disadvantage: interference and reliability::2.4 GHz is crowded (other APs, Bluetooth, microwaves) and walls weaken the signal, causing drop-outs.",
    "Disadvantage: shared, lower bandwidth::Wi-Fi is half-duplex and an AP's bandwidth is shared, so a full lecture hall slows down; wired gives each user dedicated full-duplex speed."
  ],
  tip:"Your lecturer: “the only people who did not score were those who would just write ‘installation’ and ‘scalability’. Please provide the explanation.” Every point = name + explanation + link to the students." },

{ id:"wifi-types", t:"wifi", tier:3, marks:4,
  q:"Identify two main types of wireless network and give one example of a technology used in each.",
  seen:["2025 test"],
  pts:[
    "WPAN (Wireless Personal Area Network)::Low power, short range (6–9 m), IEEE 802.15, 2.4 GHz. Example: Bluetooth or Zigbee.",
    "WLAN (Wireless LAN)::Medium-sized networks up to about 300 feet, IEEE 802.11, 2.4 or 5 GHz. Example: Wi-Fi.",
    "WMAN (Wireless Metropolitan Area Network)::A city or district, licensed frequencies. Example: WiMAX (IEEE 802.16, up to 50 km).",
    "WWAN (Wireless Wide Area Network)::National or global coverage, licensed frequencies. Example: cellular (GSM, CDMA) or satellite broadband."
  ],
  tip:"" },

{ id:"wifi-ap", t:"wifi", tier:2, marks:4,
  q:"Explain the difference between autonomous (standalone) access points and controller-based (lightweight) access points.",
  seen:["2026 test (2 marks)","2025 test"],
  pts:[
    "Autonomous AP::A standalone device configured through its own CLI or GUI. Each acts independently and an administrator configures and manages it manually, which is fine for a home or small office but slow and inconsistent at scale.",
    "Controller-based (lightweight) AP::Managed by a Wireless LAN Controller (WLC) using LWAPP/CAPWAP. Each LAP is configured and managed automatically by the WLC: central configuration, security policy and roaming for many APs.",
    "In one line::Autonomous = each AP managed by hand; lightweight = all APs managed centrally by the WLC (split MAC: the AP does beacons, ACKs and encryption, the WLC does authentication and association)."
  ],
  tip:"" },

{ id:"wifi-csmaca", t:"wifi", tier:2, marks:5, steps:true,
  q:"Explain the CSMA/CA process and how it helps prevent collisions in wireless networks. (2015 version: explain the role of the Virtual Carrier Sense mechanism and its control packets.)",
  seen:["2025 test","2015 test (5 + 8 marks)","2024 test (vs CSMA/CD)"],
  pts:[
    "Listen::The client listens to see if the channel is idle (no other traffic). If it's busy, it waits a random backoff time.",
    "Request To Send::The client sends an RTS to the AP asking for dedicated access; the RTS carries how long the transfer will take.",
    "Clear To Send::The AP replies with a CTS granting access. Every other station that hears the CTS sets its NAV (Network Allocation Vector) and stays silent for that time. This is virtual carrier sense.",
    "Transmit::The client sends its data. If no CTS arrived, it waits a random time and restarts.",
    "Acknowledge::The receiver acknowledges every frame. No ACK means the client assumes a collision happened and restarts the process.",
    "Why this prevents collisions::A wireless client can't hear while sending (half-duplex), so it can't detect collisions. Instead it reserves the medium first, avoiding them."
  ],
  tip:"Control packets for the 2015 question: RTS (request + duration), CTS (grant, heard by hidden nodes too), ACK (confirms receipt); the Duration field sets the NAV." },

{ id:"wifi-threats", t:"wifi", tier:2, marks:6,
  q:"A university WLAN is experiencing slow performance, frequent disconnections and several security alerts. Analyse at least three wireless threats that could be affecting the network.",
  seen:["2025 test"],
  pts:[
    "Denial of Service (DoS)::Jamming, deauthentication floods or interference explain the slow performance and frequent disconnections. Causes: a malicious user, misconfigured devices or accidental interference.",
    "Rogue access points::An unauthorised AP (or a student's hotspot) connected to the campus network, used to capture MAC addresses and data, gain access to resources or launch a man-in-the-middle attack. This would trigger security alerts.",
    "Man-in-the-middle / evil twin::An attacker sets up an AP with the same SSID as the university's; students connect to it and the attacker reads or changes their traffic.",
    "Wireless intruders and data interception::Unauthorised users consume bandwidth (slow network) and eavesdrop on unencrypted traffic.",
    "Mitigation (bonus)::WPA2/WPA3-Enterprise with 802.1X and RADIUS, WLC rogue-AP policies and spectrum monitoring, authenticating every user, and watching for abnormal devices or traffic."
  ],
  tip:"“Analyse” = name the threat, explain how it works, link it to the symptoms in the scenario." },

{ id:"wifi-hidden", t:"wifi", tier:2, marks:6,
  q:"Nodes A and C can each communicate with B, but are out of each other's range. What is the hidden node problem, how does it affect communication, and what solutions can mitigate it? (Also: using a diagram, show how RTS/CTS reduces it.)",
  seen:["2024 test","2023 test (Alice/Bob/Carol/Dave)","2022 test","2017 supp","2015 test","2014 final"],
  pts:[
    "What it is::A and C are both in range of B but not of each other, so carrier sense fails: A can't hear C transmitting and thinks the medium is free.",
    "Effect::A and C transmit to B at the same time and their frames collide at B. Neither knows; they only find out from missing ACKs, causing retransmissions, delay and lower throughput.",
    "RTS/CTS step 1::A sends a short Request To Send (RTS) to B, saying how long it needs the medium.",
    "RTS/CTS step 2::B replies with Clear To Send (CTS). Because B is in range of both, C hears the CTS too.",
    "RTS/CTS step 3::C sets its NAV (virtual carrier sense) and stays silent for that duration; A sends its data; B sends an ACK; the medium is then free again.",
    "Other mitigations::Increase transmit power or reposition the AP/nodes so they can hear each other; add access points; remove obstacles.",
    "The diagram::Draw A — B — C in a line with a range circle around A and one around C, overlapping only at B. Arrows: RTS A→B, CTS from B to both A and C, DATA A→B, ACK B→A."
  ],
  tip:"2023 scenario version: Alice's and Carol's laptops can't hear each other but both reach the AP, so their frames collide at the AP: a choppy video call for Alice and Bob and a slow file transfer for Carol." },

{ id:"wifi-exposed", t:"wifi", tier:2, marks:4,
  q:"Describe the exposed node problem and its potential impact. (2015: explain how it differs from the hidden node problem.)",
  seen:["2023 test","2020 final","2015 test"],
  pts:[
    "What it is::A node wrongly holds back from transmitting because it hears a nearby transmission, even though its own transmission to a different receiver wouldn't interfere.",
    "Example::B is sending to A. C, next to B, hears B and defers its frame to D, although D is out of B's range and A is out of C's range. Both transfers could have happened safely at once.",
    "Impact::Wasted air time and unnecessary delay, so lower throughput. In the 2023 scenario Carol's transfer to Dave is delayed because she hears Bob's video-call traffic.",
    "Hidden vs exposed::Hidden node causes collisions (too little deferring); exposed node causes idle air time (too much deferring)."
  ],
  tip:"" },

{ id:"wifi-roaming", t:"wifi", tier:3, marks:6, steps:true,
  q:"Describe how roaming is supported when a device moves from one Basic Service Set (BSS) to another in the IEEE 802.11 (Wi-Fi) standard.",
  seen:["2022 test","2020 final","2017 supp","2014 final"],
  pts:[
    "Extended Service Set::Several APs, each forming a BSS, share the same SSID and are joined by a wired distribution system (DS). Together they form an ESS.",
    "Monitor the signal::As the station moves, it monitors the signal strength of its current AP; when it falls below a threshold it starts scanning.",
    "Scan::Passive (listen for beacons) or active (send probe requests) to find a better AP in the same ESS.",
    "Reassociate::The station authenticates with the new AP and sends a Reassociation Request; the new AP replies with a Reassociation Response.",
    "Update the distribution system::The new AP tells the old AP over the DS, buffered frames are forwarded, and the DS now delivers the station's frames through the new AP. The session isn't dropped.",
    "With a controller::In a controller-based WLAN, the WLC handles association and re-association of roaming clients centrally (split MAC)."
  ],
  tip:"" },

{ id:"wifi-services", t:"wifi", tier:3, marks:6,
  q:"Explain the importance of these station services in a WLAN: authentication, de-authentication, privacy. (Revision paper: the distribution services association, distribution and integration.)",
  seen:["2022 test","2017 supp","2015 test","Revision paper (distribution services)"],
  pts:[
    "Authentication::Verifies a station's identity before it may associate, so only authorised devices can join (open system or shared key such as WPA2).",
    "De-authentication::Ends an existing authentication when a station leaves or is removed. It frees the AP's resources and blocks further access until the station re-authenticates.",
    "Privacy::Encrypts frames (WEP/WPA/WPA2/WPA3) so people in radio range can't read the data, giving wireless the privacy a cable gives a wired LAN.",
    "Association::Links a station to one AP so the distribution system knows which AP to deliver its frames through.",
    "Distribution::Delivers frames between stations across the APs of the ESS via the distribution system.",
    "Integration::Delivers frames between the 802.11 network and a non-802.11 LAN (for example wired 802.3 Ethernet) through a portal, translating the frames."
  ],
  tip:"" },

{ id:"wifi-challenges", t:"wifi", tier:2, marks:5,
  q:"Briefly explain five challenges faced by an organisation planning to use wireless technology. (Also asked: five factors to consider before implementing a wireless network.)",
  seen:["2022 test","2017 supp","2015 test","Revision paper (factors)"],
  pts:[
    "Security::Signals leave the building; interception, intruders and rogue APs need strong authentication and encryption.",
    "Interference and reliability::Other networks, Bluetooth, microwaves and walls cause drop-outs.",
    "Range and coverage::Dead zones mean careful AP placement and a site survey.",
    "Bandwidth and density::Shared half-duplex bandwidth slows as users increase; the number of users per AP matters.",
    "Cost and planning::APs, controllers, licences and surveys; choosing a standard (802.11ac/ax) all devices support.",
    "Factors before implementing (alternative list)::Coverage area and building layout; number of users and devices; data rates the applications need; security requirements; interference and channel plan (1, 6, 11); budget; integration with the wired network."
  ],
  tip:"" },

{ id:"wifi-integration", t:"wifi", tier:3, marks:5,
  q:"Explain advantages an organisation may derive from integrating wired and wireless networks.",
  seen:["2020 final (3)","2017 supp (5)","2014 final (Lesego, 5)"],
  pts:[
    "Mobility plus a reliable backbone::Users roam on Wi-Fi while servers, labs and backbones stay on fast, reliable wired links.",
    "Coverage where cabling is hard::Wireless reaches old buildings, open areas and meeting rooms without new cable runs.",
    "Cheap scalability::New users or temporary sites are added by plugging APs into existing wired switches.",
    "Redundancy::If a cable or port fails, users can fall back to Wi-Fi, and vice versa.",
    "One management and security system::The same AD/RADIUS authentication and policies cover wired and wireless users, and it supports BYOD and guests."
  ],
  tip:"" },

{ id:"wifi-scan", t:"wifi", tier:3, marks:2,
  q:"Wireless clients connect to an AP using a passive or active scanning (probing) process. Describe the two processes.",
  seen:["2024 test"],
  pts:[
    "Passive mode::The AP openly advertises itself by periodically broadcasting beacon frames containing the SSID, supported standards and security settings; the client listens.",
    "Active mode::The client must know the SSID. It starts the process by broadcasting a probe request on multiple channels and APs reply with probe responses."
  ],
  tip:"" },

{ id:"wifi-ifs", t:"wifi", tier:3, marks:4,
  q:"In 802.11 networks multiple types of interframe spacing exist. Explain the purpose of any two.",
  seen:["2024 test"],
  pts:[
    "SIFS (Short IFS)::The shortest gap and highest priority. Used for ACK, CTS and the next fragment, so an exchange in progress finishes before anyone else can take the medium.",
    "PIFS (PCF IFS)::A medium gap used by the AP in Point Coordination Function (polling) mode to take control of the medium ahead of normal traffic.",
    "DIFS (DCF IFS)::A longer gap stations wait before sending normal data under the Distributed Coordination Function (CSMA/CA contention).",
    "EIFS (Extended IFS)::The longest, used after a station receives a corrupted frame so it doesn't collide with the ACK of a frame it couldn't read."
  ],
  tip:"Shorter gap = higher priority: SIFS < PIFS < DIFS < EIFS." },

{ id:"wifi-spread", t:"wifi", tier:3, marks:6,
  q:"Give a brief description of the IEEE 802.11 physical layer definitions: FHSS, DSSS and infrared.",
  seen:["2020 final","2017 supp"],
  pts:[
    "FHSS (Frequency-Hopping Spread Spectrum)::Transmits by rapidly switching the carrier among many frequency channels; sender and receiver must be synchronised to know which channel to jump to. Used by the original 802.11; resists interference and eavesdropping.",
    "DSSS (Direct-Sequence Spread Spectrum)::Spreads the signal over a wider frequency band so it resists interference and noise. Used by 802.11b in the 2.4 GHz band.",
    "OFDM (extra)::Splits one channel into many sub-channels on adjacent frequencies. Used by 802.11a/g/n/ac.",
    "Infrared::Uses infrared light: short range, line of sight, can't pass through walls. An original 802.11 option, now obsolete."
  ],
  tip:"" },

{ id:"wifi-wep", t:"wifi", tier:3, marks:4,
  q:"Discuss the Wired Equivalent Privacy (WEP) algorithm.",
  seen:["2020 final"],
  pts:[
    "Purpose::The original 802.11 security, meant to give wireless the privacy of a wired LAN through shared key authentication and encryption.",
    "How it works::The RC4 stream cipher with a static shared key (40 or 104 bits) combined with a 24-bit initialisation vector (IV); a CRC-32 integrity check value detects changes.",
    "Weaknesses::The IV is short and reused, the key is static and shared by everyone, and CRC-32 integrity is weak, so WEP can be cracked in minutes.",
    "Verdict::No longer recommended and should never be used; replaced by WPA (TKIP), WPA2 (AES) and WPA3 (SAE)."
  ],
  tip:"" },

{ id:"wifi-std", t:"wifi", tier:3, marks:5,
  q:"Compare IEEE 802.11a, 802.11b and 802.11g in terms of data rates, frequency bands and modulation, with a scenario where each is most suitable.",
  seen:["2023 test"],
  pts:[
    "802.11a::5 GHz, up to 54 Mbps, OFDM. Less interference but shorter range and doesn't interoperate with b/g. Suits a busy office where 2.4 GHz is congested.",
    "802.11b::2.4 GHz, up to 11 Mbps, DSSS. Longer range and better at penetrating walls. Suits basic, low-cost coverage of a large area or legacy devices.",
    "802.11g::2.4 GHz, up to 54 Mbps, OFDM, backward compatible with 802.11b. Suits a home or small office upgrading while keeping older b devices.",
    "Newer standards::802.11n (2.4 and 5 GHz, 150–600 Mbps, MIMO), 802.11ac (5 GHz, up to 1.3 Gbps), 802.11ax (High-Efficiency Wireless)."
  ],
  tip:"" },

{ id:"wifi-wap", t:"wifi", tier:3, marks:10,
  q:"(Insurance only: on 2014–2020 papers, not in the 2026 slides.) Explain how the Wireless Application Protocol (WAP) supports internetworking between GSM cellular networks and the Internet, and the concept of a deck of cards.",
  seen:["2020 final","2017 supp","2014 final"],
  pts:[
    "What WAP is::An open standard that let mobile phones on GSM networks access internet content despite small screens, low CPU power, little memory and awkward keypads.",
    "The WAP gateway::The phone's microbrowser sends a WML request over the wireless network to a WAP gateway, which turns it into an HTTP request to the web server. It converts the HTML reply into compact WML/WBXML and sends it back, bridging the cellular network and the packet-based internet.",
    "Protocol stack::WAE (application environment: microbrowser, WML, WMLScript), WSP (session), WTP (transaction), WTLS (security), WDP (datagram) over the bearer (GSM SMS, CSD, GPRS).",
    "Deck of cards::A WML file is a “deck” holding several “cards” (screens). The whole deck downloads at once, so the user moves between cards without new requests, which suits slow links and small screens.",
    "Relevance today::Largely obsolete: smartphones run full HTML browsers over 4G/5G."
  ],
  tip:"Only read this if you have spare time." },

/* ---------------- TCP/IP & SUBNETTING ---------------- */
{ id:"ip-vlsm16", t:"ip", tier:1, marks:20, est:true, lect:true,
  q:"You are allocated 172.20.0.0/16. Using VLSM (largest subnet first) design an addressing plan for: Dept A 4000 hosts, Dept B 1000 hosts, Dept C 500 hosts, Dept D 200 hosts, Dept E 60 hosts. For each give the subnet mask, network address, broadcast address and usable range.",
  seen:["Revision session: “ours is /16”","2025 test (172.18.0.0/16)"],
  pts:[
    "The method::For each subnet: hosts + 2 → round up to a power of 2 → host bits h → prefix = 32 − h. If h > 8, the 4th octet is all host bits and (h − 8) bits sit in the 3rd octet, so the block size in the 3rd octet is 2^(h−8). Never use 2^h itself as a block size: that gives numbers above 255.",
    "Dept A: 4000 → 4096 = 2^12 → /20 (255.255.240.0)::3rd-octet block = 2^4 = 16. Network 172.20.0.0, broadcast 172.20.15.255, usable 172.20.0.1 – 172.20.15.254.",
    "Dept B: 1000 → 1024 = 2^10 → /22 (255.255.252.0)::Block = 2^2 = 4. Network 172.20.16.0, broadcast 172.20.19.255, usable 172.20.16.1 – 172.20.19.254.",
    "Dept C: 500 → 512 = 2^9 → /23 (255.255.254.0)::Block = 2. Network 172.20.20.0, broadcast 172.20.21.255, usable 172.20.20.1 – 172.20.21.254.",
    "Dept D: 200 → 256 = 2^8 → /24 (255.255.255.0)::Block = 1 in the 3rd octet. Network 172.20.22.0, broadcast 172.20.22.255, usable 172.20.22.1 – 172.20.22.254.",
    "Dept E: 60 → 64 = 2^6 → /26 (255.255.255.192)::All 6 host bits are in the 4th octet, block 64. Network 172.20.23.0, broadcast 172.20.23.63, usable 172.20.23.1 – 172.20.23.62."
  ],
  tip:"Lay it out as a table (Dept | hosts | prefix | mask | network | first | last | broadcast) and show one working line per subnet. Your lecturer: “you need the block size in each of those octets… two of the bits are in the third octet… 2 to the power 2, which means it's four.” Practise in the Subnet lab until it's automatic." },

{ id:"ip-vlsm2025", t:"ip", tier:1, marks:16,
  q:"You are allocated the Class B block 172.18.0.0/16. Using VLSM (largest first) design a plan for: Dept A 300 hosts, Dept B 120 hosts, Dept C 50 hosts, Dept D 12 hosts. Give the subnet mask, network address, broadcast address and usable range for each.",
  seen:["2025 test"],
  pts:[
    "Dept A: 300 → 512 → /23 (255.255.254.0)::9 host bits: 8 in the 4th octet, 1 in the 3rd, so block 2. Network 172.18.0.0, broadcast 172.18.1.255, usable 172.18.0.1 – 172.18.1.254.",
    "Dept B: 120 → 128 → /25 (255.255.255.128)::Network 172.18.2.0, broadcast 172.18.2.127, usable 172.18.2.1 – 172.18.2.126.",
    "Dept C: 50 → 64 → /26 (255.255.255.192)::Network 172.18.2.128, broadcast 172.18.2.191, usable 172.18.2.129 – 172.18.2.190.",
    "Dept D: 12 → 16 → /28 (255.255.255.240)::Network 172.18.2.192, broadcast 172.18.2.207, usable 172.18.2.193 – 172.18.2.206."
  ],
  tip:"The trap is Dept A: 300 hosts is bigger than one octet, so the subnet crosses into the 3rd octet." },

{ id:"ip-vlsm2026", t:"ip", tier:1, marks:20,
  q:"First Horizon Regional Bank has 172.20.0.0/24. Using VLSM (largest first) design a plan for: Branch A 100 hosts, Branch B 50, Branch C 20, Branch D 8, Branch E 2. Give the CIDR prefix, network address, usable range and broadcast address for each.",
  seen:["2026 test"],
  pts:[
    "Branch A: 100 → 128 → /25 (255.255.255.128)::Network 172.20.0.0, usable 172.20.0.1 – 172.20.0.126, broadcast 172.20.0.127.",
    "Branch B: 50 → 64 → /26 (255.255.255.192)::Network 172.20.0.128, usable .129 – .190, broadcast 172.20.0.191.",
    "Branch C: 20 → 32 → /27 (255.255.255.224)::Network 172.20.0.192, usable .193 – .222, broadcast 172.20.0.223.",
    "Branch D: 8 → 16 → /28 (255.255.255.240)::Network 172.20.0.224, usable .225 – .238, broadcast 172.20.0.239. (8 hosts + 2 = 10, so /29 with 6 usable is too small.)",
    "Branch E: 2 → 4 → /30 (255.255.255.252)::Network 172.20.0.240, usable .241 – .242, broadcast 172.20.0.243."
  ],
  tip:"Watch hosts that are exact powers of 2 (8, 16, 32, 64): add 2 first, then round up." },

{ id:"ip-vlsm24", t:"ip", tier:2, marks:25,
  q:"Create an efficient addressing scheme for these LANs using 192.168.1.0/24: Net 1 110 hosts, Net 2 50, Net 3 14, Net 4 12, Net 5 6. Start with the zero subnet for the largest. (a) What class is this address? What fixed-length mask would you use, and what is the disadvantage of FLSM here? (b) Implement VLSM: mask, network ID, broadcast ID and usable range for each subnet.",
  seen:["2022 test","2017 supp"],
  pts:[
    "Class::Class C (first octet 192, range 192–223; default mask 255.255.255.0).",
    "FLSM mask::One mask for every subnet must fit the largest LAN (110 hosts → 128 addresses), so 255.255.255.128 (/25).",
    "FLSM disadvantage::A /25 gives only 2 subnets, not enough for 5 LANs, and every LAN gets 126 addresses, so the 6-host LAN wastes over 100. (Borrowing 3 bits for 8 subnets gives only 30 hosts each: too small for 110.) Hence VLSM.",
    "Net 1: 110 → /25 (255.255.255.128)::Network 192.168.1.0, broadcast 192.168.1.127, usable .1 – .126.",
    "Net 2: 50 → /26 (255.255.255.192)::Network 192.168.1.128, broadcast .191, usable .129 – .190.",
    "Net 3: 14 → /28 (255.255.255.240)::Network 192.168.1.192, broadcast .207, usable .193 – .206 (14 + 2 = 16 exactly).",
    "Net 4: 12 → /28 (255.255.255.240)::Network 192.168.1.208, broadcast .223, usable .209 – .222.",
    "Net 5: 6 → /29 (255.255.255.248)::Network 192.168.1.224, broadcast .231, usable .225 – .230 (6 + 2 = 8 exactly)."
  ],
  tip:"" },

{ id:"ip-and", t:"ip", tier:2, marks:19,
  q:"(a) Explain the purpose of subnetting and the effect of a subnet mask on IP address interpretation [4]. (b) Find the network ID of 192.168.170.85 with mask 255.255.255.224, showing working [3]. (c) VLSM for 192.168.170.0: Marketing 5, Sales 85, Accounts 20 users [12].",
  seen:["Revision paper"],
  pts:[
    "Purpose of subnetting::Divides one network into smaller networks bounded by routers: smaller broadcast domains and less broadcast traffic, better use of addresses, and easier security and management (for example one subnet per department).",
    "Effect of the mask::The mask tells a host which bits are network (1s) and which are host (0s). The same address can mean different networks with different masks: 138.23.0.0/16 is not the same network as 138.23.0.0/24.",
    "Network ID by ANDing::85 = 01010101 and 224 = 11100000; AND gives 01000000 = 64. Network ID = 192.168.170.64 (block 32: 0, 32, 64, 96… and 85 falls in 64–95).",
    "Sales 85 → /25 (255.255.255.128)::Network 192.168.170.0, broadcast .127, usable .1 – .126.",
    "Accounts 20 → /27 (255.255.255.224)::Network 192.168.170.128, broadcast .159, usable .129 – .158.",
    "Marketing 5 → /29 (255.255.255.248)::Network 192.168.170.160, broadcast .167, usable .161 – .166."
  ],
  tip:"Slide example to know: 129.56.189.41 with 255.255.240.0 → network 129.56.176.0." },

{ id:"ip-window", t:"ip", tier:1, marks:5, steps:true, lect:true,
  q:"With the aid of a diagram, explain how traffic congestion is managed by TCP dynamic windowing flow control. (2025: describe how TCP uses the variable-length sliding window so the sender doesn't overwhelm the receiver.)",
  seen:["2026 test","2025 test"],
  pts:[
    "Variable-length sliding window::The window is how many segments the sender may send before it must wait for acknowledgements.",
    "Window of 1::The sender starts with a window of one segment, S(0). It is delivered and acknowledged with ACK(0).",
    "Window of 2::The sender increases the window to two segments, S(1) and S(2), which are acknowledged when received.",
    "Window of 3, congestion::The window grows to three segments, S(3)–S(5). The network becomes congested and segment S(3) is lost.",
    "Timer detects the loss::The sender starts a timer whenever it sends a segment. When S(3)'s timer expires without an ACK, it resends the segment.",
    "Reset to 1::After the retransmission timeout the sender resets the window to one segment and the process repeats, slowing the sender to relieve the congestion.",
    "The diagram::Two vertical lines (Sender, Receiver) with the IP network between them. Arrows down: S(0) →, ← ACK(0); bracket “window 2” around S(1), S(2) with ACKs; bracket “window 3” around S(3)–S(5) with an X on S(3); then the timer and S(3) resent with window 1."
  ],
  tip:"Your lecturer on this one: “it's copy and paste, nothing more.” Learn the slide's six steps and draw the diagram every time." },

{ id:"ip-protocols", t:"ip", tier:3, marks:4,
  q:"Explain one key difference between TCP, UDP, ICMP and ARP in terms of their role in a network. (2024: two functions of TCP, two of IP, when to use UDP, two UDP applications.)",
  seen:["2025 test","2024 test","Revision paper (HTTP and UDP)"],
  pts:[
    "TCP::Connection-oriented and reliable: sequence numbers, ACKs, retransmission and flow control so data arrives complete and in order (web, email, file transfer).",
    "UDP::Connectionless with no acknowledgements: low overhead and fast, but no delivery guarantee. Use it when speed matters more than reliability, for real-time or small request/response traffic: DNS, DHCP, VoIP, video streaming, online games.",
    "ICMP::Error reporting and diagnostics for IP: ping (echo request/reply), traceroute, destination unreachable, time exceeded, redirect, source quench.",
    "ARP::Resolves a known IP address into a MAC address on the local segment by broadcasting a request; the owner replies, and results are cached in the ARP table.",
    "IP functions::Logical addressing (source and destination IP in every header), routing datagrams between networks, fragmentation and reassembly, header checksum. Connectionless and unacknowledged.",
    "HTTP::Application-layer request/response protocol that transfers web pages between browser and web server over TCP port 80 (HTTPS 443). Example: a browser requests www.bac.ac.bw and the server returns HTML."
  ],
  tip:"" },

{ id:"ip-dhcp", t:"ip", tier:3, marks:8, steps:true,
  q:"Explain in detail the DHCP process, clearly highlighting all the signals used to issue IPv4 addresses.",
  seen:["2020 final"],
  pts:[
    "DHCPDISCOVER::The client (no IP yet, source 0.0.0.0) broadcasts to 255.255.255.255 on UDP port 67 looking for a DHCP server.",
    "DHCPOFFER::Each DHCP server that hears it offers a free address from its scope, with the subnet mask, default gateway, DNS server and lease time.",
    "DHCPREQUEST::The client broadcasts a request accepting one offer; broadcasting tells the other servers their offers were declined.",
    "DHCPACK::The chosen server confirms; the client configures the address and the lease starts. (A DHCPNAK means the address is no longer valid.)",
    "Renewal and release::At 50% of the lease the client asks the same server to renew; at 87.5% it asks any server. DHCPRELEASE gives the address back."
  ],
  tip:"D-O-R-A: Discover, Offer, Request, Acknowledge. 8 marks = 2 per signal." },

/* ---------------- CLOUD, VIRTUALISATION, SDN ---------------- */
{ id:"cl-why", t:"cloud", tier:1, marks:5, est:true, lect:true,
  q:"Why would an organisation want cloud computing? Explain the issues cloud computing addresses.",
  seen:["Revision session: “Why do we want cloud computing?”","2026 slides"],
  pts:[
    "Access anywhere, any time::Organisational data and applications are reachable from any device with internet access.",
    "Subscribe only to needed services::Pay-as-you-go turns large capital spending into a monthly operating cost and streamlines IT operations.",
    "Less on-site IT::Eliminates or reduces on-site equipment, maintenance and management; the provider patches and repairs.",
    "Lower costs::Saves on equipment, energy, physical space and staff training.",
    "Rapid scaling::Responds quickly to growing data volumes and demand (elasticity) and scales back down when demand drops.",
    "Resilience (extra)::Providers replicate across data centres, giving built-in backup and disaster recovery."
  ],
  tip:"" },

{ id:"cl-service", t:"cloud", tier:1, marks:6, est:true, lect:true,
  q:"Explain the three cloud service models (SaaS, PaaS, IaaS), what the provider manages in each, and give an example of each.",
  seen:["Revision session: “What are service models?”","Scenario revision","2026 slides"],
  pts:[
    "SaaS: Software as a Service::The provider delivers complete applications over the internet and manages everything; users just use them. Examples: Microsoft 365, Gmail/Google Workspace, Salesforce.",
    "PaaS: Platform as a Service::The provider gives a platform (OS, runtime, middleware, development tools); the customer manages only its own applications and data. Examples: Azure App Service, Google App Engine, AWS Elastic Beanstalk.",
    "IaaS: Infrastructure as a Service::The provider gives virtualised compute, storage and network; the customer manages the OS, middleware, runtime, data and applications. Examples: AWS EC2, Azure Virtual Machines, Google Compute Engine.",
    "Who manages what::The stack is Applications, Data, Runtime, Middleware, OS, Virtualisation, Compute, Storage, Network. IaaS: provider manages virtualisation and below. PaaS: provider manages up to the runtime. SaaS: provider manages all of it.",
    "Defined by NIST::NIST Special Publication 800-145 defines the three. Providers have extended this to ITaaS (IT support as a service), extending capability without new infrastructure, staff training or licences."
  ],
  tip:"Scenario version: a startup that wants rapid development without managing servers should choose PaaS: developers just write and deploy code." },

{ id:"cl-deploy", t:"cloud", tier:1, marks:8, est:true, lect:true,
  q:"Describe the four cloud deployment models.",
  seen:["Revision session: “What are deployment models?”","2026 slides"],
  pts:[
    "Public cloud::Applications and services available to the general population over the internet, owned by a provider (AWS, Azure, Google Cloud). Cheapest and most scalable; least control.",
    "Private cloud::Intended for one organisation or entity only (for example a government department or bank), on-premises or hosted. Most control and security; highest cost.",
    "Hybrid cloud::Two or more clouds (for example part private, part public) where each part stays separate but they're connected by a single architecture. Sensitive data stays private while other workloads use the public cloud.",
    "Community cloud::Built for exclusive use by a specific community with shared needs, for example healthcare organisations that must comply with HIPAA authentication and confidentiality rules. Costs and compliance are shared."
  ],
  tip:"Deployment models = where and for whom (public, private, hybrid, community). Service models = what you get (SaaS, PaaS, IaaS). Keep them apart." },

{ id:"cl-nist", t:"cloud", tier:2, marks:5,
  q:"What are the key characteristics of cloud computing, and how do they give advantages over traditional IT infrastructure?",
  seen:["Scenario revision"],
  pts:[
    "On-demand self-service::Users provision resources themselves, when needed, with no human interaction with the provider.",
    "Broad network access::Services are reachable over the network using standard devices and browsers.",
    "Resource pooling::The provider's resources serve many customers, allocated dynamically according to demand.",
    "Rapid elasticity::Resources scale up or down quickly with demand.",
    "Measured service::Usage is metered, so customers pay only for what they use. Advantage over traditional IT: no hardware to buy and maintain, lower capital cost, and flexibility."
  ],
  tip:"" },

{ id:"cl-providers", t:"cloud", tier:1, marks:6, est:true, lect:true,
  q:"How are cloud platforms such as AWS, Microsoft Azure and Google Cloud used by organisations?",
  seen:["Revision session: “Azure, AWS, Google… how are they using cloud services?”"],
  pts:[
    "Amazon Web Services (AWS)::The largest public cloud: EC2 virtual servers (IaaS), S3 storage, RDS managed databases, Lambda serverless functions. Used to host websites and apps and for backup.",
    "Microsoft Azure::Virtual Machines (IaaS), App Service (PaaS), Entra ID/Azure AD for identity, Microsoft 365 (SaaS). Strong hybrid links with on-premises Windows Server and Active Directory.",
    "Google Cloud Platform::Compute Engine (IaaS), App Engine (PaaS), BigQuery analytics and AI tools; Google Workspace (SaaS: Gmail, Drive, Docs).",
    "What organisations use them for::Hosting websites and e-commerce, file storage and backup, disaster recovery, test and development environments, big data and AI, email and collaboration, paying per use instead of buying servers."
  ],
  tip:"Link each platform to a service model: that shows understanding, not just names." },

{ id:"cl-ki", t:"cloud", tier:2, marks:8,
  q:"Kotso Inc. (KI), a startup, records near-misses at busy intersections 24/7 with cameras and local computing, sending only the “interesting” video to the cloud. For elasticity, no upfront cost and reduced IT maintenance, say whether each benefit is important to KI and why [6]. KI now covers 75% of the world's big cities: should it build its own private cloud? [2]",
  seen:["2020 final"],
  pts:[
    "Elasticity: Yes::The amount of interesting video varies (more incidents on some days) and KI keeps adding intersections and cities, so storage and analysis capacity must grow and shrink without buying hardware.",
    "No upfront cost: Yes::As a startup, KI avoids the capital cost of servers and a data centre and pays as it grows, keeping cash for its core product.",
    "Reduced IT maintenance: Yes::A small startup has few IT staff; the provider patches, maintains and replaces hardware so KI can focus on video analytics.",
    "Private cloud: No (or hybrid at most)::Building data centres across continents is a huge capital cost and needs large operations teams. Public providers already have global regions, elasticity and redundancy. A private or hybrid cloud makes sense only if regulations force data to stay in each country or the scale makes owning cheaper."
  ],
  tip:"Table questions: Yes/No plus a reason tied to the scenario for each row. The reason earns the marks." },

{ id:"cl-virt-why", t:"cloud", tier:1, marks:6, est:true, lect:true,
  q:"Why would an organisation virtualise its servers and networks? Explain the problems with dedicated servers and the advantages of virtualisation.",
  seen:["Revision session: “Why would we need to virtualise?”","Scenario revision","2026 slides"],
  pts:[
    "Problems with dedicated servers::One OS and one service per physical server: hardware sits idle most of the time, wastes energy and space (server sprawl), and one component failure takes the service down (single point of failure).",
    "What virtualisation does::Separates the OS from the hardware; a hypervisor runs many virtual machines on one physical server. It's the foundation of cloud computing.",
    "Reduced cost::Less equipment, less energy and less space are required.",
    "Easier prototyping and faster provisioning::New systems are created and tested quickly in isolated VMs, and a new server takes minutes instead of a purchase order.",
    "Increased uptime and better disaster recovery::Live migration moves VMs off hardware under maintenance; VMs are files that are easy to back up, replicate and restore.",
    "Legacy support::Older operating systems and software keep running on new hardware inside a VM."
  ],
  tip:"" },

{ id:"cl-hyper", t:"cloud", tier:1, marks:4, est:true, lect:true,
  q:"Differentiate Type 1 and Type 2 hypervisors, with examples of each.",
  seen:["Revision session: “the hypervisors… which ones are we using?”","2026 slides"],
  pts:[
    "Type 1 (bare metal)::Installed directly on the server hardware, with guest OSs on top. Direct hardware access makes it more efficient, scalable and robust; used on enterprise servers and in data centres. Examples: VMware ESXi, Microsoft Hyper-V, Xen/Citrix Hypervisor, KVM.",
    "Type 1 needs a management console::Management software (for example VMware vCenter, Cisco UCS Manager) manages many servers, consolidates them, moves VMs automatically when hardware fails and allows memory over-allocation.",
    "Type 2 (hosted)::Software running on top of a host OS (Windows, macOS, Linux) that creates and runs VMs. Easy to install with no management console needed, but slower because it goes through the host OS. Used for labs, testing and desktops. Examples: Oracle VirtualBox, VMware Workstation/Player, Parallels.",
    "Key terms::Host machine and host OS = the physical side; guest machine and guest OS = the virtual side; hypervisor = Virtual Machine Monitor (VMM). In class you used VirtualBox (Type 2); Hyper-V is a Type 1 role in Windows Server."
  ],
  tip:"" },

{ id:"cl-virt-types", t:"cloud", tier:2, marks:6, est:true, lect:true,
  q:"Describe the various types of virtualisation.",
  seen:["Revision session: “the various types of virtualisation”"],
  pts:[
    "Server (compute) virtualisation::Many virtual servers on one physical host via a hypervisor.",
    "Network virtualisation::One physical device split into many virtual devices: VLANs, subinterfaces, virtual interfaces and virtual routing and forwarding (VRF); taken further by SDN.",
    "Storage virtualisation::Physical disks pooled into virtual volumes or a SAN that is managed as one.",
    "Desktop virtualisation (VDI)::User desktops run as VMs in the data centre and are accessed remotely.",
    "Full virtualisation (emulation)::A complete VM emulating all the hardware, so an unmodified OS runs as if on a real machine.",
    "Paravirtualisation::The guest OS knows it shares the machine and cooperates directly with the hypervisor. Faster, but the OS must be slightly modified.",
    "Characteristics of VMs::Partitioned, isolated, encapsulated (a VM is a set of files) and hardware independent."
  ],
  tip:"" },

{ id:"cl-priv", t:"cloud", tier:2, marks:6,
  q:"Operating systems use privileged instructions to manage hardware such as page tables and I/O. On a hypervisor with full hardware virtualisation, what happens when a guest OS executes such an instruction? [4] Give one advantage of full hardware virtualisation over paravirtualisation [2].",
  seen:["2020 final"],
  pts:[
    "It traps::The guest OS runs deprivileged (in a lower-privilege, non-root mode). When it executes a privileged instruction the CPU traps to the hypervisor (a VM exit) instead of touching the real hardware.",
    "The hypervisor emulates it::The hypervisor checks the instruction and performs the equivalent action on the VM's virtual hardware (shadow or extended page tables, a virtual I/O device), then returns control to the guest (VM entry).",
    "Why::This keeps VMs isolated: no guest controls the real hardware or affects other VMs, yet the guest OS believes it is on real hardware. This is “trap and emulate”, assisted by Intel VT-x / AMD-V.",
    "Advantage of full virtualisation::It runs unmodified guest operating systems (for example Windows or legacy OSs) because the guest doesn't need to know it is virtualised. Paravirtualisation needs a modified OS."
  ],
  tip:"" },

{ id:"cl-sdn", t:"cloud", tier:1, marks:5, est:true, lect:true,
  q:"What is Software-Defined Networking (SDN), why is it important, and how does it work?",
  seen:["Revision session: “and SDN… read about all that”","2026 slides (new)"],
  pts:[
    "What it is::One central piece of software, the SDN controller, controls the whole network instead of every router and switch deciding for itself. The “brain” moves out of the devices into the controller; the devices just forward traffic.",
    "Analogy::A traditional network is a city where every junction has its own traffic officer; SDN is one control room directing all the junctions.",
    "Why: easier management and flexibility::Change the whole network from one place instead of configuring each device; the network adapts quickly when new servers or VMs appear.",
    "Why: time, cost, security, cloud::Automation cuts manual work and human error; security rules are set once and applied consistently everywhere; it's what lets data centres and clouds scale on demand.",
    "How it works in three steps::(1) Decide centrally: the administrator sets rules in the controller, such as who can reach what. (2) Send instructions: the controller passes the rules to every switch and router. (3) Forward traffic: devices move data along the paths the controller chose."
  ],
  tip:"Use the slide's exact three steps: decide centrally, send instructions, forward traffic." },

{ id:"cl-netvirt", t:"cloud", tier:3, marks:4,
  q:"Explain why server virtualisation makes network management more complex (East-West vs North-South traffic).",
  seen:["2026 slides"],
  pts:[
    "Hidden, movable servers::Server virtualisation hides the number and identity of physical servers. VMs move between hosts, so their network profiles must move too, which is manual and slow on traditional switches.",
    "East-West traffic::Most data-centre traffic now flows between virtual servers inside the data centre, and it changes in location and intensity over time.",
    "North-South traffic::Traffic between the data centre and outside (other data centres, cloud providers, the internet).",
    "Fix::Virtualise network functions (VLANs, VRF) and use SDN so the network can be reprogrammed quickly; in big multivendor networks, manual reconfiguration for every new VM is too slow."
  ],
  tip:"" },

{ id:"cl-scenarios", t:"cloud", tier:3, marks:6,
  q:"Scenario revision: a company migrates physical servers to Hyper-V on Windows Server 2019. What steps ensure success? And what factors should a VMware shop evaluate before moving workloads to a hybrid cloud?",
  seen:["Scenario revision"],
  pts:[
    "Migration steps::Assess the hardware (CPU virtualisation support, RAM, storage); plan the VMs (number, CPU, RAM, storage, networks); back up everything; install and configure the Hyper-V role; convert physical machines to VMs (P2V tools); test the VMs and applications before switching over.",
    "Hybrid cloud: compatibility::Will the VMware workloads run in the target cloud?",
    "Hybrid cloud: cost::Compare on-premises CAPEX and OPEX with cloud subscription costs.",
    "Hybrid cloud: security and compliance::Encryption and regulatory rules for sensitive data.",
    "Hybrid cloud: integration, performance, recovery::Seamless management between on-premises and cloud; latency, availability and bandwidth; the provider's disaster-recovery and backup options."
  ],
  tip:"" },

{ id:"cl-spine", t:"cloud", tier:3, marks:6,
  q:"Scenario revision: what is spine-leaf data-centre architecture, its benefits, and how does it differ from the traditional three-tier design?",
  seen:["Scenario revision"],
  pts:[
    "Spine-leaf::Two layers. Leaf (access) switches connect the servers; every leaf connects to every spine switch.",
    "Benefits::Scales by adding switches without redesign; low latency (every device is at most two hops away); redundancy (losing a spine doesn't cut anything off); ECMP spreads traffic over many equal paths.",
    "Three-tier::Core, aggregation and access layers; traffic between access switches must climb through aggregation and core, creating bottlenecks.",
    "Difference::Spine-leaf is flatter, more scalable, lower latency, with even traffic distribution, ideal for East-West traffic."
  ],
  tip:"" },

/* ---------------- SECURITY & MANAGEMENT ---------------- */
{ id:"sec-policy", t:"sec", tier:1, marks:4, lect:true,
  q:"You join an organisation that has no security policy. Explain four arguments you can raise to support implementing one. (Also know what a policy should include and its three goals.)",
  seen:["2020 final","2026 slides"],
  pts:[
    "Protects the business's data and assets::Sets out how customer data, finances and systems are safeguarded, preventing losses from breaches, theft and downtime.",
    "Clear rules and accountability::Employees know what's acceptable (application use, passwords, remote access, wireless) and what happens if they break the rules, so misuse can be dealt with.",
    "Legal and regulatory compliance::Shows due care under data-protection laws and standards such as PCI DSS, avoiding fines.",
    "Consistent, layered defence and faster response::Everyone applies the same controls in layers and knows what to do in an incident.",
    "What it should include::Physical security, acceptable use of applications, safeguarding data, remote access, the data centre, wireless security.",
    "Its three goals::Prevent the hacker getting critical data; slow the hacker down enough to be caught; frustrate the hacker enough to quit."
  ],
  tip:"" },

{ id:"sec-detect", t:"sec", tier:1, marks:4,
  q:"Suggest four (or five) ways you can detect an attack, or a threat of attack, on your network.",
  seen:["2020 final","2017 supp (5)","2014 final"],
  pts:[
    "IDS/IPS alerts::An intrusion detection system watches traffic for attack signatures and anomalies (hacking attempts, worms, DDoS) and raises alerts; an IPS sits inline and drops them.",
    "Log monitoring and auditing::Review firewall, server and event logs for repeated failed logins, logons at odd hours, new admin accounts or privilege changes.",
    "Compare against the network baseline::A sudden jump in traffic, response times or errors compared to the recorded baseline signals an attack (DoS, a spreading worm, data being copied out).",
    "Protocol analyser / traffic capture::Tools like Wireshark reveal unusual protocols, ports or destinations.",
    "Antivirus and endpoint alerts::Up-to-date antivirus and host intrusion prevention flag malware on clients and servers.",
    "Rogue devices and user reports::Scan the radio spectrum for rogue APs; investigate unexplained slowness, pop-ups or changed files that users report."
  ],
  tip:"This question appears on 3 of the 4 past finals. Give one method plus what it reveals; don't just list four tool names." },

{ id:"sec-hardware", t:"sec", tier:1, marks:4, est:true, lect:true,
  q:"How should an organisation protect its network hardware (physical security)?",
  seen:["Revision session: “hardware security, software security”","2026 slides"],
  pts:[
    "The first level::Physical security is the first layer of any network's security: if someone can touch the server, most other controls can be bypassed.",
    "Separate critical nodes::Keep servers and network equipment away from the general workforce, in a central location only a select group can enter (locked server room, access cards, entry logs, CCTV).",
    "Locked cabinets::If space is limited and nodes must sit near employees, keep servers at least in a locked cabinet or rack.",
    "Protect power and environment (extra)::UPS, cooling and fire suppression; keep backups off-site; disable unused network ports."
  ],
  tip:"" },

{ id:"sec-software", t:"sec", tier:1, marks:6, est:true, lect:true,
  q:"Explain how software is protected against malware and hackers, describing the main types of malware.",
  seen:["Revision session: “software security”","2026 slides"],
  pts:[
    "The threats::Malware and hackers. Hackers are usually driven by greed, ego or vengeance and look for personal gain through system vulnerabilities.",
    "Prevention plan::The two most important elements: install and maintain virus-prevention software on servers and clients (updated regularly), and run virus-awareness training for users.",
    "Virus, worm, macro virus::A virus attaches itself to a file or program and spreads when it runs; a worm spreads by itself across the network with no host file; a macro virus hides in Word/Excel macros and runs when the file opens.",
    "Polymorphic, stealth, boot-sector::A polymorphic virus changes its code each time it copies itself to avoid detection; a stealth virus hides from antivirus; a boot-sector virus infects the startup area of a drive.",
    "Trojan, logic bomb::A Trojan looks like useful software but carries hidden harmful code; a logic bomb is dormant code that triggers when a condition (such as a date) is met.",
    "User training and endpoints::Users update antivirus daily (at least weekly), learn how viruses spread and scan removable devices before use. Endpoints get antivirus, host intrusion prevention and network access control."
  ],
  tip:"" },

{ id:"sec-firewall", t:"sec", tier:2, marks:6,
  q:"Describe firewalls and the four firewall topologies, and distinguish an IDS from an IPS.",
  seen:["2026 slides"],
  pts:[
    "Firewall::The primary way to keep hackers out. It sits between the private LAN and the internet as a gatekeeper, filtering every packet entering or leaving; hardware or software, personal or enterprise.",
    "Packet-filtering router::A router that allows or blocks packets using rules applied to header information (IP addresses, ports, protocol).",
    "Single-homed bastion::A hardened host with one network connection, placed behind a firewall or router that handles external traffic.",
    "Dual-homed bastion::A hardened host with two connections (internal and external) that controls all traffic between them.",
    "DMZ::A separate subnet between the internal and external networks that holds public-facing servers (web, email). If they're compromised, the internal LAN stays protected.",
    "IDS vs IPS::An IDS detects attempts to gain access, virus outbreaks, worms and DDoS, and alerts. An IPS is placed inline so every packet passes through it, and it drops packets based on the administrator's rules."
  ],
  tip:"" },

{ id:"sec-mitigate", t:"sec", tier:1, marks:6, lect:true,
  q:"Explain the three basic strategies for mitigating security threats on routers and switches (with the commands to enable SSH).",
  seen:["2026 slides"],
  pts:[
    "Use SSH instead of Telnet::SSH encrypts all data, including passwords; Telnet sends everything in clear text. Use SSH version 2 on all VTY lines.",
    "Turn off unnecessary services::Every running service is a way in. Disable those you don't use (Finger, PAD, TCP/UDP small servers, BOOTP server, CDP, IP source route, directed broadcast, ICMP redirects, proxy ARP) using the CLI or the SDM Security Audit Wizard.",
    "Keep up to date on security patches::A patch-management programme closes known vulnerabilities, such as those worms exploit.",
    "SSH commands::Router(config)# hostname SshRouter → ip domain-name sshtest.com → crypto key generate rsa (creates the RSA key pair SshRouter.sshtest.com) → then on line vty 0 4: transport input ssh."
  ],
  tip:"" },

{ id:"sec-patch", t:"sec", tier:1, marks:6, est:true, lect:true,
  q:"Explain how an administrator manages backups, upgrades, updates and patches, and what a patch management programme should include.",
  seen:["Revision session: “backing up, upgrading, patching”","2026 slides"],
  pts:[
    "Why stay current::New malware is released constantly, so antivirus versions and OS/application patches must be kept current. Patches for all known vulnerabilities are what stop worm attacks.",
    "Central patch server::With many servers and PCs, a central patch server (for example WSUS) automatically downloads and installs any missing patches without user intervention.",
    "Cover all software::The programme must account for all software: commercial applications and those developed in-house, not just the OS.",
    "Plan around vendors and the business::Follow the major vendors' release schedules and fit patching to the organisation's business goals (maintenance windows, off-hours).",
    "Test before deploying::Not all vendor patches are flawless: test on a few machines first and keep a rollback plan.",
    "Backups::Back up before any upgrade or patch and on a regular schedule (full and incremental, an off-site copy, test restores) so systems recover after a failure, a bad patch or ransomware."
  ],
  tip:"" },

{ id:"sec-aaa", t:"sec", tier:2, marks:4,
  q:"Explain Authentication, Authorization and Accounting (AAA) and the services used to provide it.",
  seen:["2026 slides"],
  pts:[
    "Authentication::Who you are: verifying identity with passwords, PAP, CHAP or certificates.",
    "Authorization::What you may do: which resources or commands the user is allowed while connected.",
    "Accounting::What you did: a record of actions and usage, for auditing and billing.",
    "Services::RADIUS and TACACS+ (Cisco) are the common AAA protocols that centralise this; RADIUS uses UDP 1812 and 1813. PAP sends the password in clear text; CHAP uses a challenge-response hash so the password isn't sent."
  ],
  tip:"" },

{ id:"sec-vpn", t:"sec", tier:2, marks:6,
  q:"Explain VPNs (client-to-site and site-to-site) and how IPSec secures them.",
  seen:["2026 slides"],
  pts:[
    "Purpose of a VPN::Lets remote users and sites reach the corporate network securely over the public internet through an encrypted tunnel, instead of costly private lines.",
    "Client-to-site (remote user) VPN::Designated users reach the corporate network from remote locations such as home or travel.",
    "Site-to-site VPN::Connects multiple corporate sites over low-cost internet links. Tunnelling protocols: PPTP, L2TP, GRE, IPSec.",
    "IPSec::An industry-standard protocol suite securing data at layer 3 (IP only). Transport mode encrypts packets host-to-host (heavy on the processor); tunnel mode encrypts everything in the tunnel (Cisco's mode).",
    "AH vs ESP::AH (Authentication Header) gives authentication and integrity but no encryption; ESP (Encapsulating Security Payload) encrypts with 3DES or AES. HMACs (MD5, SHA-1) ensure integrity; ISAKMP manages keys; a transform set names the protocol, algorithm and key management."
  ],
  tip:"" },

{ id:"sec-baseline", t:"sec", tier:2, marks:4,
  q:"What is a network baseline, why is it needed and how is it built? What elements are needed to scale a small network?",
  seen:["2026 slides"],
  pts:[
    "Definition::A record of how the network normally performs, built up over time.",
    "Purpose::A normal reference point to compare against, so you can spot problems such as slow response times, errors or attacks, and plan for growth.",
    "How to build it::Copy the results of ping and traceroute into text files, time-stamp each one, and note error messages and host-to-host response times. A big rise in response times signals latency to fix.",
    "Scaling a network::Needs network documentation, a device inventory, a budget and traffic analysis (protocol analysers at busy times and in different places), plus IT snapshots of employee use (OS, applications, CPU, RAM and drive use)."
  ],
  tip:"" },

{ id:"sec-trouble", t:"sec", tier:1, marks:6, est:true, lect:true, steps:true,
  q:"When problems occur on the network, how should the administrator handle them? Describe a structured troubleshooting approach.",
  seen:["Revision session: “and if there are problems, how do we handle that?”"],
  pts:[
    "Identify the problem::Gather information: question the users, note the symptoms and error messages, and find out what changed recently.",
    "Establish a theory of probable cause::Start with the obvious (cable, power, IP settings) and work through the layers, physical up to application, comparing with the baseline.",
    "Test the theory::Use ping, tracert, ipconfig, nslookup and the logs. If the theory is wrong, form a new one or escalate.",
    "Plan and implement the fix::Consider side effects, back up first, schedule disruptive work off-hours, then apply the fix.",
    "Verify full functionality::Confirm users can work again and add preventive measures (patching, monitoring).",
    "Document::Record the problem, the cause and the fix so it is faster next time."
  ],
  tip:"Scenario examples to practise with: a user can't join the 802.11ac Wi-Fi (range, other devices, SSID and security settings, restart the adapter, AP/WLC status, interference); a DNS fault (check DNS settings, ping the DNS server, nslookup, server logs, restart or fail over to a secondary)." },

{ id:"sec-ransom", t:"sec", tier:2, marks:6, steps:true,
  q:"A server running critical services is infected with ransomware. What immediate actions do you take to limit the impact and recover?",
  seen:["Scenario revision"],
  pts:[
    "Isolate::Disconnect the server from the network immediately to stop the ransomware spreading.",
    "Escalate::Notify the security team and follow the incident response plan.",
    "Identify::Identify the ransomware strain and check whether a known decryption tool exists.",
    "Restore::Restore data from recent clean backups (don't pay the ransom).",
    "Clean or rebuild::Run full scans with trusted anti-malware tools, or rebuild the server, then apply all patches and updates.",
    "Learn::Review security policies and strengthen defences to prevent a repeat."
  ],
  tip:"" },

{ id:"sec-faulttol", t:"sec", tier:3, marks:6,
  q:"Describe the ideal set of mechanisms for the fault tolerance of a LAN.",
  seen:["2014 final"],
  pts:[
    "Redundant links and paths::Mesh or dual links between switches, with spanning tree or link aggregation, so one cable failure doesn't cut anyone off.",
    "Redundant devices and components::Two core switches, dual power supplies, NIC teaming.",
    "Server fault tolerance::Clustering and failover, load balancing, RAID disks.",
    "Power protection::UPS and a generator.",
    "Backups and disaster recovery::Regular backups kept off-site and a tested recovery plan.",
    "Redundant WAN::A second ISP link or a backup VPN for internet and branch connectivity."
  ],
  tip:"" },

{ id:"sec-threats", t:"sec", tier:2, marks:6,
  q:"What are common types of network security threats, and how can they be mitigated? (Plus: strong password rules.)",
  seen:["Scenario revision","2026 slides (passwords)"],
  pts:[
    "Threats::Malware (viruses, worms, ransomware), phishing, denial of service, man-in-the-middle attacks and insider threats.",
    "Firewalls and IDS/IPS::Block and detect malicious traffic at the network edge.",
    "Patch regularly::Keep software up to date to close vulnerabilities.",
    "Strong authentication::Strong password policies and multifactor authentication.",
    "Train and monitor::Regular security training for employees; monitor and audit network traffic for suspicious activity.",
    "Strong passwords::At least 8 characters (preferably 10 or more); a mix of upper and lower case, numbers, symbols and spaces; no dictionary words, sequences, usernames, relatives' or pets' names; changed often. Cisco routers support passphrases."
  ],
  tip:"" },

{ id:"sec-loadbal", t:"sec", tier:3, marks:4,
  q:"Explain load balancing and how you would configure it for a web application on three servers that slows down at peak times.",
  seen:["Scenario revision"],
  pts:[
    "What it is::Distributing network traffic across several servers so none is overwhelmed. It improves performance, availability and reliability, and gives redundancy if a server fails.",
    "Set up a load balancer::Put it in front of the three servers to distribute incoming requests.",
    "Health checks::Send traffic only to servers that are up and performing well.",
    "Algorithms and monitoring::Round-robin, least connections or IP hash; monitor traffic patterns and tune the configuration for peak times."
  ],
  tip:"" }
];
