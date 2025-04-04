terraform {
    required_providers {
        aws=    {
            source = "hashicorp/aws"
            version = "5.89.0"
        }
    }
}

provider "aws"{
    region = "us-east-1"
}

#Creamos una VPS para el proyecto
resource "aws_vpc" "goTrip_VPC" {
  cidr_block = "10.10.0.0/16" #255.255.0.0
  tags = {
    Name = "goTrip_VPC"
  }
}

#Creamos una subred publica para el Frontend
resource "aws_subnet" "public_Subnet" {
  vpc_id     = aws_vpc.goTrip_VPC.id
  cidr_block = "10.10.0.0/24" #255.255.255.0

  tags = {
    Name = "public_Subnet"
  }
}

#Creamos una subred privada para el Backend
resource "aws_subnet" "private_Subnet" {
  vpc_id     = aws_vpc.goTrip_VPC.id
  cidr_block = "10.10.1.0/24" #255.255.255.0

  tags = {
    Name = "private_Subnet"
  }
}

#Internet gateway para flujo a internet
resource "aws_internet_gateway" "internet_gateway" {
  vpc_id = aws_vpc.goTrip_VPC.id

  tags = {
    Name = "internet_gateway"
  }
}

#Route table para subred publica
resource "aws_route_table" "public_subnet_RouteTable" {
  vpc_id = aws_vpc.goTrip_VPC.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.internet_gateway.id
  }

  route {
    #cidr_block = aws_subnet.public_Subnet.cidr_block 
    cidr_block = aws_vpc.goTrip_VPC.cidr_block # Rango CIDR de la VPC
    gateway_id = "local" # Tráfico local dentro de la VPC
  }


  tags = {
    Name = "public_subnet_route_table"
  }
}

#Creamos una asociacion, donde asociamos la RT a la subnet
resource "aws_route_table_association" "public_association_RT" {
  subnet_id = aws_subnet.public_Subnet.id
  route_table_id = aws_route_table.public_subnet_RouteTable.id
}


/*
#Creamos una elastic ip para la nat, es necesaria para crear una NAT
resource "aws_eip" "NAT_ElasticIP" {
  domain = "vpc"
  depends_on = [aws_internet_gateway.internet_gateway]
}

#Creamos una NAT para permitir la conexion saliente de internet para nuesta subred privada
resource "aws_nat_gateway" "goTrip_NAT" {
  allocation_id = aws_eip.NAT_ElasticIP.id
  subnet_id     = aws_subnet.public_Subnet.id

  tags = {
    Name = "gw NAT"
  }

  # To ensure proper ordering, it is recommended to add an explicit dependency
  # on the Internet Gateway for the VPC.
  depends_on = [aws_internet_gateway.internet_gateway]
}


#Crear Route table para la pivate subred
resource "aws_route_table" "private_subnet_RT" {
  vpc_id = aws_vpc.goTrip_VPC.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_nat_gateway.goTrip_NAT.id
  }

  tags = {
    Name = "public_private_route_table"
  }
}

#Creamos una asociacion, donde asociamos la RT a la subnet
resource "aws_route_table_association" "private_association_RT" {
  subnet_id      = aws_subnet.private_Subnet.id
  route_table_id = aws_route_table.private_subnet_RT.id
}
*/

#CONFIGURACION PARA INSTANCIA EC2 MICRO DE FRONTEND
resource "aws_security_group" "GoTripFrontEnd_SGPublic"{
    name    =   "GoTrip_FrontEnd_SG_Public"
    description = "Set the security group of the instance GoTripFrontEnd"
    vpc_id = aws_vpc.goTrip_VPC.id

    tags = {
      Name= "GoTripFrontEndSG"
    }
}

resource "aws_vpc_security_group_ingress_rule" "GoTripFrontEndSG_ssh" {
    security_group_id = aws_security_group.GoTripFrontEnd_SGPublic.id
    cidr_ipv4 = "0.0.0.0/0"
    from_port = 22
    ip_protocol = "tcp"
    to_port = 22

    tags = {
      Name= "SSH_FrontEndSG"
    }

}

resource "aws_vpc_security_group_ingress_rule" "GoTripFrontEndSG_http" {
    security_group_id = aws_security_group.GoTripFrontEnd_SGPublic.id
    cidr_ipv4 = "0.0.0.0/0"
    from_port =80
    ip_protocol = "tcp"
    to_port = 80

    tags = {
      Name= "HTTP_FrontEndSG"
    }
}

/*
resource "aws_vpc_security_group_ingress_rule" "GoTripFrontEndSG_intranet" {
    security_group_id = aws_security_group.GoTripFrontEnd_SGPublic.id
    cidr_ipv4 = "10.10.0.0/16"
    from_port =8080
    ip_protocol = "tcp"
    to_port =8080

    tags = {
      Name= "Intranet_FrontEndSG"
    }
}
*/

resource "aws_vpc_security_group_ingress_rule" "GoTripFrontEndSG_https" {
    security_group_id = aws_security_group.GoTripFrontEnd_SGPublic.id
    cidr_ipv4 = "0.0.0.0/0"
    from_port =443
    ip_protocol = "tcp"
    to_port = 443

    tags = {
      Name= "HTTPS_FrontEndSG"
    }
}

/* resource "aws_vpc_security_group_ingress_rule" "GoTripBackEndSG_postgresql" {
    security_group_id = aws_security_group.GoTripBackEndSG.id
    cidr_ipv4 = "0.0.0.0/0"
    from_port =5432
    ip_protocol = "tcp"
    to_port = 5432
}
 */

resource "aws_vpc_security_group_egress_rule" "GoTripFrontEndSG_allow_all_trafic" {
  security_group_id = aws_security_group.GoTripFrontEnd_SGPublic.id
  cidr_ipv4 = "0.0.0.0/0"
  ip_protocol = "-1" #Todos los puertos

  tags = {
      Name= "INTERNET_FrontEndSG"
    }
}

resource "aws_instance" "GoTripFrontEnd" {

    ami = "ami-04b4f1a9cf54c11d0"
    instance_type = "t2.micro"

    key_name ="GotripFrontEnd"
    
    vpc_security_group_ids = [aws_security_group.GoTripFrontEnd_SGPublic.id]
    private_ip = "10.10.0.12"
    subnet_id  = aws_subnet.public_Subnet.id
    associate_public_ip_address = "true"

    tags = {
      Name = "GoTripFrontEnd"
    }
}

#CONFIGURACION PARA INSTANCIA EC2 MICRO DE BACKEND
resource "aws_security_group" "GoTripBackEnd_SGPublic"{
    name    =   "GoTrip_BackEnd_SG_Public"
    description = "Set the security group of the instance GoTripBackEnd"
    vpc_id = aws_vpc.goTrip_VPC.id

    tags = {
      Name= "GoTripBackEndSG"
    }
}


resource "aws_vpc_security_group_ingress_rule" "GoTripBackEndSG_http" {
    security_group_id = aws_security_group.GoTripBackEnd_SGPublic.id
    cidr_ipv4 = "10.10.0.12/32"
    from_port =80
    ip_protocol = "tcp"
    to_port = 80

    tags = {
      Name= "HTTP_BackEndSG"
    }
}

/*
resource "aws_vpc_security_group_ingress_rule" "GoTripBackEndSG_https" {
    security_group_id = aws_security_group.GoTripBackEnd_SGPublic.id
    cidr_ipv4 = "0.0.0.0/0"
    from_port =443
    ip_protocol = "tcp"
    to_port = 443

    tags = {
      Name= "HTTPS_BackEndSG"
    }
}
*/

resource "aws_vpc_security_group_ingress_rule" "GoTripBackEndSG_ssh" {
    security_group_id = aws_security_group.GoTripBackEnd_SGPublic.id
    cidr_ipv4 = "0.0.0.0/0"
    from_port =22
    ip_protocol = "tcp"
    to_port = 22

    tags = {
      Name= "SSH_BackEndSG"
    }
}

resource "aws_vpc_security_group_egress_rule" "GoTripBackEndSG_allow_all_trafic" {
  security_group_id = aws_security_group.GoTripBackEnd_SGPublic.id
  cidr_ipv4 = "0.0.0.0/0"
  ip_protocol = "-1" #Todos los puertos

  tags = {
      Name= "INTERNET_BackEndSG"
    }
}
/*
resource "aws_vpc_security_group_ingress_rule" "GoTripBackEndSG_intranet" {
    security_group_id = aws_security_group.GoTripFrontEnd_SGPublic.id
    cidr_ipv4 = "10.10.0.0/16"
    from_port =8080
    ip_protocol = "tcp"
    to_port =8080

    tags = {
      Name= "Intranet_BackEndSG"
    }
}*/

resource "aws_instance" "GoTripBackEnd" {

    ami = "ami-04b4f1a9cf54c11d0"
    instance_type = "t2.micro"

    key_name ="GoTripBackEnd"
    
    vpc_security_group_ids = [aws_security_group.GoTripBackEnd_SGPublic.id]
    private_ip = "10.10.0.13"
    subnet_id  = aws_subnet.public_Subnet.id
    associate_public_ip_address = "true"

    tags = {
      Name = "GoTripBackEnd"
    }
}

#CONFIGURACION PARA INSTANCIA EC2 MICRO DE BASE DE DATOS
resource "aws_security_group" "GoTripDataBase_SGPublic"{
    name    =   "GoTrip_DataBase_SG_Public"
    description = "Set the security group of the data base instance"
    vpc_id = aws_vpc.goTrip_VPC.id

    tags = {
      Name= "GoTripDataBaseSG"
    }
}

resource "aws_vpc_security_group_ingress_rule" "GoTripDataBase_ssh" {
    security_group_id = aws_security_group.GoTripDataBase_SGPublic.id
    cidr_ipv4 = "0.0.0.0/0"
    from_port =22
    ip_protocol = "tcp"
    to_port = 22

    tags = {
      Name= "SSH_DataBase"
    }
}

resource "aws_vpc_security_group_ingress_rule" "GoTripDataBase_Posgresql" {
    security_group_id = aws_security_group.GoTripDataBase_SGPublic.id
    //cidr_ipv4 = "0.0.0.0/0"
    cidr_ipv4 = "10.10.0.13/32"
    from_port =5432
    ip_protocol = "tcp"
    to_port = 5432

    tags = {
      Name= "Postgresql_DataBase"
    }
}

resource "aws_vpc_security_group_ingress_rule" "GoTripDataBase_DevPosgresql" {
    security_group_id = aws_security_group.GoTripDataBase_SGPublic.id
    cidr_ipv4 = "0.0.0.0/0"
    //cidr_ipv4 = "10.10.0.13/32"
    from_port =5432
    ip_protocol = "tcp"
    to_port = 5432

    tags = {
      Name= "Dev_Postgresql_DataBase"
    }
}


resource "aws_vpc_security_group_egress_rule" "GoTripDataBaseSG_allow_all_trafic" {
  security_group_id = aws_security_group.GoTripDataBase_SGPublic.id
  cidr_ipv4 = "0.0.0.0/0"
  ip_protocol = "-1" #Todos los puertos

  tags = {
      Name= "INTERNET_DataBaseSG"
    }
}

resource "aws_instance" "GoTripDataBase" {

    ami = "ami-04b4f1a9cf54c11d0"
    instance_type = "t2.micro"

    key_name ="GoTripDataBase"
    
    vpc_security_group_ids = [aws_security_group.GoTripDataBase_SGPublic.id]
    private_ip = "10.10.0.14"
    subnet_id  = aws_subnet.public_Subnet.id
    associate_public_ip_address = "true"

    tags = {
      Name = "GoTripDataBase"
    }
}

#CREAR LA ROUTE ZONE
resource "aws_route53_zone" "GoTrip_RouteZone" {
  name = "gotrip.lat"

  tags = {
    name = "GoTripRouteZone"
  }
}

#CREAR EL RECORD PARA ENLAZAR EL DOMINIO CON LA IP PUBLICA DE LA EC2 DEL FRONT
resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.GoTrip_RouteZone.zone_id
  name    = ""
  type    = "A"
  ttl     = 300
  records = [aws_instance.GoTripFrontEnd.public_ip]
}

#MONITOREO
resource "aws_cloudwatch_dashboard" "GoTrip" {
  dashboard_name = "GoTrip_Monitoring"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"

        properties = {
          period = 300
          region = "us-east-1"
          title  = "EC2 Instances CPU"
          timezone ="0500"
          metrics = [
            [
              "AWS/EC2",
              "CPUUtilization",
              "InstanceId",
              aws_instance.GoTripFrontEnd.id
            ],
            [
              "AWS/EC2",
              "CPUUtilization",
              "InstanceId",
              aws_instance.GoTripBackEnd.id
            ],
            [
              "AWS/EC2",
              "CPUUtilization",
              "InstanceId",
              aws_instance.GoTripDataBase.id
            ]

          ]
        }
      },

      {
        type   = "metric"

        properties = {

          period = 300
          region = "us-east-1"
          title  = "EC2 GoTripFrontEnd Network traffic"
          timezone ="-0500"
          metrics = [
            [
              "AWS/EC2",
              "NetworkIn",
              "InstanceId",
              aws_instance.GoTripFrontEnd.id
            ],
            [
              "AWS/EC2",
              "NetworkOut",
              "InstanceId",
              aws_instance.GoTripFrontEnd.id
            ]

          ]
        }
      }
      ,
      {
        type   = "metric"

        properties = {

          period = 300
          region = "us-east-1"
          title  = "EC2 GoTripBackEnd Network traffic"
          timezone ="-0500"
          metrics = [
            [
              "AWS/EC2",
              "NetworkIn",
              "InstanceId",
              aws_instance.GoTripBackEnd.id
            ],
            [
              "AWS/EC2",
              "NetworkOut",
              "InstanceId",
              aws_instance.GoTripBackEnd.id
            ]

          ]
        }
      },

      {
        type   = "metric"

        properties = {

          period = 300
          region = "us-east-1"
          title  = "EC2 GoTripDataBase Network traffic"
          timezone ="-0500"
          metrics = [
            [
              "AWS/EC2",
              "NetworkIn",
              "InstanceId",
              aws_instance.GoTripDataBase.id
            ],
            [
              "AWS/EC2",
              "NetworkOut",
              "InstanceId",
              aws_instance.GoTripDataBase.id
            ]

          ]
        }
      }
      
    ]
  })
}
resource "aws_cloudwatch_metric_alarm" "CPU" {
  alarm_name                = "GoTrip CPU"
  comparison_operator       = "GreaterThanOrEqualToThreshold"
  evaluation_periods        = 1
  metric_name               = "CPUUtilization"
  namespace                 = "AWS/EC2"
  period                    = 300
  statistic                 = "SampleCount"
  threshold                 = 80
  alarm_description         = "This metric monitors ec2 cpu utilization"
  insufficient_data_actions = []
  tags = {
    name="GoTrip_CPU_Alarm"
  }
}