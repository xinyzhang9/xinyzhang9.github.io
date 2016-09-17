import os
c = 0
for fileName in os.listdir("."):
	if fileName.endswith("gif"):
	    os.rename(fileName, "action_"+str(c)+".gif")
	    c = c+1