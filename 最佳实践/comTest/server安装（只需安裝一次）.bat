@echo on
start /d "exe\" regedit.reg
start /d "exe\" node-v10.14.2-x64.msi
start /d "exe\" yarn-1.12.3.msi
start cmd /k "yarn global add serve"
