pipeline{
    
    environment {
        
        imagename = "jcbtmy/versatime"
        
        keyName = "sshPrivateKey"

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

                    sh "docker save $imagename:latest | gzip > versatime.tar.gz"
                }

                sshagent(credentials: [keyName]) {

                    sh "ssh versacall@192.168.100.67"
                    sh "ls"
                }
            }
        }
        
        stage("Cleanup")
        {
            steps{

                echo "-->Cleaning Images and Workspace<--"
            
                sh "docker rmi $imagename:latest"

                //sh "rm -rf *"
            }
        }
    }
}