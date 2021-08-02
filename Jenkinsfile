pipeline{
    
    environment {
        
        imagename = "jcbtmy/versatime"
        
        registryCredential = 'jcbtmy-dockerhub'
        
        dockerImage = ''
    }
    
    
    agent any
    
    
    
    stages{
       
        stage('Build'){
         
            steps{
                
                echo "-->Building Front End<----"
                
                 //build compile front end src
                dir("front"){
                    
                    sh "npm install"
                    sh "npm run build"
                    
                }
                
                sh "rm -r back/public/*"
                
                sh "mv front/build/ back/public/"



                echo "-->Building Docker Image<--"
                        
                dir("back"){
                        
                    script{
                            
                        dockerImage = docker.build imagename
                            
                    }
                }    
            }
        }
        
        
        stage("Deploy")
        {
            steps{
                
                echo "-->Deploying Image<--"
                    
                script {

                    sh "docker save $imagename:latest -o versatime.tar"

                    sh "pwd"

                    /*
                        
                    docker.withRegistry( '', registryCredential ) {
                            
                        dockerImage.push("$BUILD_NUMBER")
                        dockerImage.push('latest')
                    }

                    */
                    
                }
            }
        }
        
        stage("Cleanup")
        {
            steps{

                echo "-->Cleaning Images and Workspace<--"
            
                sh "docker rmi $imagename:latest"

                sh "rm -rf *"
            }
        }
    }
}