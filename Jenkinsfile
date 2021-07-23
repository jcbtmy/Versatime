pipeline{
    
    environment {
        
        imagename = "jcbtmy/versatime"
        
        registryCredential = 'jcbtmy-dockerhub'
        
        dockerImage = ''
    }
    
    
    agent any
    
    
    
    stages{
         //clean workspace
        stage('Clean') {
            steps{    
                sh "rm -rf *"
            }
        }   
    
        stage('Checkout')
        {
            steps{
                sh "git fetch origin"
                sh "git reset --hard origin/main"
            }
        }
        
        stage('Build Src'){
         
            steps{
                
                sh "echo '--->Building Front End<-----'"
                
                 //build compile front end src
                dir("front"){
                    
                    sh "npm install"
                    sh "npm run build"
                    
                }
                
                sh "rm -r back/public/*"
                
                sh "mv front/build/ back/public/"
                
            }
        }
        
        
        stage("Build Image")
        {
            steps{
                
                echo "-->Building Docker Image<--"
                        
                dir("back"){
                        
                    script{
                            
                        dockerImage = docker.build imagename
                            
                    }
                }
                    
            }
        }
        
        stage("Deploy Image")
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
        
        stage("Remove Image")
        {
            steps{
                sh "docker rmi $imagename:$BUILD_NUMBER"
                sh "docker rmi $imagename:latest"
            }
        }
    }
}