name: "Bug Report"
description: "Submit a bug report (an error or somethings just not working right)"
#title: "[Bug] "
labels: [bug]
body:
  - type: checkboxes
    id: no-duplicate-issues
    attributes:
      label: "Please verify that this bug has NOT been raised before."
      description: "Search in the issues sections by clicking [HERE](https://github.com/404invalid-user/PteroStats/issues?q=)"
      options:
        - label: "I checked and didn't find similar issue"
          required: true
  
  - type: textarea
    id: description
    validations:
      required: false
    attributes:
      label: "Description"
      description: "You could also upload screenshots"
 
  - type: textarea
    id: steps-to-reproduce
    validations:
      required: true
    attributes:
      label: "Reproduction steps"
      description: "How do you trigger this bug? Please walk us through it step by step."
      placeholder: "..."
 
  - type: textarea
    id: expected-behavior
    validations:
      required: true
    attributes:
      label: "Expected behavior"
      description: "What do you expect to happen?"
      placeholder: "..."
 
  - type: textarea
    id: actual-behavior
    validations:
      required: true
    attributes:
      label: "Actual Behavior"
      description: "What actually happen?"
      placeholder: "..."

  - type: input
    id: pterostatus-version
    attributes:
      label: "PteroStatus Version"
      description: "Which version of PteroStatus are you using? this can be found under version in the package.json file"
      placeholder: "Eg. 1.0.0"
    validations:
      required: true

  - type: checkboxes
    id: running-in-ptero
    attributes:
      label: "running on ptero"
      description: "are you running it in pterodactyl?"
      options:
        - label: "yes i am"
          required: true

  - type: checkboxes
    id: using-custom-egg
    attributes:
      label: "using the provided custom egg"
      description: "are you using the custom egg i provide for it?"
      options:
        - label: "yes i am"
          required: true

  - type: input
    id: operating-system
    attributes:
      label: "💻 Operating System and Arch"
      description: "Which OS is your server/device running on?"
      placeholder: "Eg. Debian 11"
    validations:
      required: true

  - type: textarea
    id: logs
    attributes:
      label: "Relevant log output"
      description: "copy and paste any relevant log output removing domains and other pii. This will be automatically formatted into code, so no need for backticks."
      render: shell
    validations:
      required: false
