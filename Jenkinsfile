pipeline{
    
    environment {
        
        imagename = "jcbtmy/versatime"
        
        registryCredential = 'jcbtmy-dockerhub'
        
        dockerImage = ''
    }
    
    
    agent any
    
    
    
    stages{
/*
        stage('Checkout')
        {
            steps{
                sh "git fetch origin"
                sh "git reset --hard origin/main"
            }
        }
*/        
        stage('Build'){
         
            steps{
                
                sh "echo '-->Building Front End<----'"
                
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
                        
                    docker.withRegistry( '', registryCredential ) {
                            
                        dockerImage.push("$BUILD_NUMBER")
                        dockerImage.push('latest')
                    }
                    
                }
            }
        }
        
        stage("Cleanup")
        {
            steps{

                sh "-->Cleaning Images and Workspace<--"
                sh "docker rmi $imagename:$BUILD_NUMBER"
                sh "docker rmi $imagename:latest"

                sh "rm -rf *"
            }
        }
    }
}