# Laucnh script. Will create the abundance table and then choose  the correct script to execute, following data/visualization
# All is saved in an HTML file which is parsed then displayed.
# TODO: Find a place to store static images.
# TODO: Find the good place to store all the scripts

# Console log
message(paste(Sys.time(),'[Message] Launched script launch.R'))

# Loading of needed libraries and sources
library(methods)
library(rCharts)
library(xtable)
source("R/preProcess.r")


# Allow R to read command arguments
parameters <- commandArgs(TRUE)

# Small check to see number of arguments
print(length(parameters))

files <- (strsplit(parameters[1],split=',')[[1]]) # Creation of a vector of file names from the list in parameter
data <- parameters[2] # Chosen data
keep <- as.logical(parameters[3]) # Keep names or not ?
name <- parameters[4] # output file name
level <- as.integer(parameters[5]) # Level of collapsing (if there is collapsing ...)
vis <- parameters[6] # Chosen visualization

# Print arguments to see if everything is okay
print(parameters)

# Launch abundance table creation script and print it for debugging
abTable = CreateAbTable(files, data, keep, name, level)
print(abTable)

# Depending on the data / visualization, create the right stuff.
# This is a prototype and the job is done in a very dirty/inefficient way.

#########################################
########## GO slim | Barcharts ##########
#########################################

if(data=='GOslim' & vis=='bar'){
source('R/vis/GOslimBar.r')
bio = CreateGraphForCategory(abTable,'biological_process')
mol = CreateGraphForCategory(abTable,'molecular_function')
cell = CreateGraphForCategory(abTable,'cellular_component')
message('OK. Now save and grep.')

# Save
mol$save(paste('R/Graphs/mol/',name,'.htm',sep=''),cdn=TRUE)
bio$save(paste('R/Graphs/bio/',name,'.htm',sep=''),cdn=TRUE)
cell$save(paste('R/Graphs/cell/',name,'.htm',sep=''),cdn=TRUE)

# Grab some code
fileNames = c(paste('R/Graphs/mol/',name,'.htm',sep=''),
paste('R/Graphs/bio/',name,'.htm',sep=''),
paste('R/Graphs/cell/',name,'.htm',sep=''))
fileContent = c(paste(readLines(fileNames[1]),collapse='\n'),paste(readLines(fileNames[2]),collapse='\n'),paste(readLines(fileNames[3]),collapse='\n'))
grabbedStyle <- regmatches(fileContent[1], regexpr('<script src=\'http://.+</style>', fileContent[1]))
grabbedBio <- regmatches(fileContent[1], regexpr('<div id=\'chart.+</script>', fileContent[1]))
grabbedMol <- regmatches(fileContent[2], regexpr('<div id=\'chart.+</script>', fileContent[2]))
grabbedCell <- regmatches(fileContent[3], regexpr('<div id=\'chart.+</script>', fileContent[3]))

# Remove the files to keep space
file.remove(fileNames)

# Write the final result
write(c(grabbedStyle,grabbedMol,grabbedBio,grabbedCell),paste('R/Graphs/',name,'.htm',sep=''))

}

#########################################
####### GO slim | Stacked Bars ##########
#########################################
if(data=='GOslim' & vis=='stackbar') {

# Call needed methods
source('R/vis/GOslimStack.r')
# Use methods, save, grab useful data
stackedBar = CreateGraph(abTable,1)
stackedBar$save(paste('R/Graphs/tmp/',name,'.htm',sep=''),cdn=TRUE) # save temporary file

# Grab some code
fileName = paste('R/Graphs/tmp/',name,'.htm',sep='')
fileContent = paste(readLines(fileName),collapse='\n')
grabbedStyle <- regmatches(fileContent, regexpr('<script src=\'http://.+</style>', fileContent))
grabbedGraph <- regmatches(fileContent, regexpr('<div id=\'chart.+</script>',fileContent))

# Remove the files to keep space
file.remove(fileName)

# Write final result file
write(c(grabbedStyle,grabbedGraph),paste('R/Graphs/',name,'.htm',sep=''))

}

#########################################
######## Abundance table only ###########
#########################################
if(vis=='table') {
message(paste(Sys.time(),'[Message] Displaying of abundance table launched'))
htmlTable = print(xtable(t(abTable)),type='html')
write(htmlTable,paste('R/Graphs/',name,'.htm',sep=''))
}

#########################################
########### Static Heatmap ##############
#########################################
if(vis=='heatmap') {
source('R/vis/StaticHeatmap.r')
pathAndName = paste('src/main/webapp/img/comparison/',name,'.png',sep='')
GenerateHeatmap(abTable,pathAndName)

# A bit tricky with the JSTL paths ... But display this anyway
write(paste('<img src=\"','/metagenomics/img/comparison/',name,'.png\">',sep=''),paste('R/Graphs/',name,'.htm',sep=''))
}

#########################################
######## Interactive heatmap ############
#########################################
if(vis=='int-heatmap') {
# Highcharts Heatmap Hack (quite dirty)
write('Still a prototype... Be patient.',paste('R/Graphs/',name,'.htm',sep=''))
}

#########################################
######## Header for result page #########
#########################################



# Deleting generated table

# Console log
message(paste(Sys.time(),'[Message] R scripts over.'))
