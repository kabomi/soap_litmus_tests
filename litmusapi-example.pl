#!/usr/bin/perl

use 5.006;
use SOAP::Lite 'trace', 'debug' ;

# Sample code to create a new email test using Litmus' Reseller Api
# This sample uses SOAP:Lite, available at: http://www.soaplite.com/


$api_key = "api-key";
$api_password = "api-password";
$test_id = "123"; #put a test id you have permission to here

$api_ns = "https://soapapi.litmusapp.com/";
$api_types = "https://soapapi.litmusapp.com/encodedTypes";
$api_url = "https://soapapi.litmusapp.com/2010-06-21/api.asmx";

sub create_test
{
my $server= SOAP::Lite
-> readable(1)
-> ns($api_types,'types')
-> ns($api_ns,'tns')
-> proxy($api_url)
-> on_action(sub { return "\"$_[1]\"" }) ;

$user = SOAP::Data->name("apiKey"=>$api_key);
$pass = SOAP::Data->name("apiPass"=>$api_password);

$iphoneClient = SOAP::Data->name("item" => \SOAP::Data->value(
                SOAP::Data->name("ApplicationName" => "IPHONE3")
                ))->type("types:Client");
                
                
$gmailClient = SOAP::Data->name("item" => \SOAP::Data->value(
                SOAP::Data->name("ApplicationName" => "GMAILNEW")
                ))->type("types:Client");
                
$ffAolClient = SOAP::Data->name("item" => \SOAP::Data->value(
                SOAP::Data->name("ApplicationName" => "FFAOLONLINE")
                ))->type("types:Client");
                
my @clients = ();
push(@clients,$iphoneClient);
push(@clients,$gmailClient);
push(@clients,$ffAolClient); 
  
$testParam = SOAP::Data->name("emailTest" => \SOAP::Data->value(
		SOAP::Data->name("TestType" => 'email'),
		SOAP::Data->name("Sandbox")->value('false')->type('boolean'),
                SOAP::Data->name("Results" => \@clients)->type("soapenc:Array")->attr({"soapenc:arrayType","types:Client[".@clients."]"})
		 ));

my $newTest = $server -> CreateEmailTest($user,$pass,$testParam);
print "Test created!  Send an email to " . $newTest->valueof("//InboxGUID/") . "\@emailtests.com\n";
}

sub get_test{
                
my $server= SOAP::Lite
-> readable(1)
-> ns($api_types,'types')
-> ns($api_ns,'tns')
-> proxy($api_url)
-> on_action(sub { return "\"$_[1]\"" }) ;
 
$user = SOAP::Data->name("apiKey"=>$api_key);
$pass = SOAP::Data->name("apiPass"=>$api_password);
$testId = SOAP::Data->name("emailTestID"=>$_[0]);

my $retrieveTest = $server -> GetEmailTest($user,$pass,$testId);

print $retrieveTest->valueof("//ID/");
}

