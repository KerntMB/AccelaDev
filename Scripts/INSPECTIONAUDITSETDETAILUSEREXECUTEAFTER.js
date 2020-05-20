 //schedule inspection//scheduleInspection(InspectionModel inspectionModel,SysUserModel actor)//--------------------------------------------------------------------------------------------------------------------aa.print("InspectionAuditSetDetailUserExecuteAfter debug");aa.print("ServiceProviderCode=" + aa.env.getValue("ServiceProviderCode"));aa.print("CurrentUserID=" + aa.env.getValue("CurrentUserID"));aa.print("SetID=" + aa.env.getValue("SetID"));aa.print("AuditType=" + aa.env.getValue("AuditType"));var inspectionIDList = aa.env.getValue("SetMemberArray");var sequenceNumber=84003932;  //Inspection Type sequence numbervar scheduleDateStr="11/17/2009"; //format: "MM/dd/yyyy"var comment="test carry over by EMSE";var scheduledDate = aa.date.transToJavaUtilDate(new Date(scheduleDateStr));var noSuccess = 0;var noFail = 0;for(var i=0; i < inspectionIDList.length; i++){	var inspIDModel = inspectionIDList[i];	var capID = inspIDModel.getCapID();	var inspectionScriptModelResult = aa.inspection.getInspection(capID,inspIDModel.getInspectionID());	if(inspectionScriptModelResult.getSuccess())	{		inspectionScriptModel = inspectionScriptModelResult.getOutput();	}	else	{		aa.print(inspectionScriptModelResult.getErrorMessage());		break;	}	var inspectionModel = inspectionScriptModel.getInspection();	var activityModel = inspectionModel.getActivity();	var inspScriptModel = aa.inspection.getInspectionScriptModel().getOutput();	surpriseInspectionModel = inspScriptModel.getInspection();	activityModel1 = surpriseInspectionModel.getActivity();	activityModel1.setCapIDModel(capID);	activityModel1.setInspSequenceNumber(sequenceNumber);	activityModel1.setActivityDate(scheduledDate);	activityModel1.setCarryoverFlag("A"); // set carry over flag	commentModel = inspectionModel.getRequestComment();	commentModel.setText(comment);	surpriseInspectionModel.setActivity(activityModel1);	surpriseInspectionModel.setRequestComment(commentModel);	// schedule the inspection	var operator = getSysUserByID("ADMIN");	var result = aa.inspection.scheduleInspection(surpriseInspectionModel,operator);	var childInspectionID;	if(result.getSuccess())	{     		childInspectionID = result.getOutput(); 	}	else	{   		aa.print("Schedule inspection failed.");   		aa.print(result.getErrorMessage());		break;	}		var scriptResult = aa.inspection.createInspectionRelation(inspIDModel,childInspectionID);        if(scriptResult.getSuccess())	{		noSuccess = noSuccess + 1;	}	else 	{		noFail = noFail + 1;	}}printMessage();function printMessage(){	if(noSuccess > 0)	{		aa.print(noSuccess + " surprise inspection(s) generated successfully!");	}		if(noFail > 0)	{		aa.print(noFail + " surprise inspection(s) generated failed!");	}}function getCapIDModel(capID1,capID2,capID3){	var result = aa.cap.getCapID(capID1, capID2, capID3);	var capIDModel = null;	if(result.getSuccess())	{    	 	capIDModel= result.getOutput();	}	else	{		aa.print("Get getCapID fail.");	}	return capIDModel;}//get system user information.function getSysUserByID(userId){	var inspector = null;	if(userId != null)	{		var inspectorResult = aa.people.getSysUserByID(userId);		if(inspectorResult.getSuccess())		{			inspector = inspectorResult.getOutput();		}	}	return inspector;}aa.env.setValue("ScriptReturnCode","0");aa.env.setValue("ScriptReturnMessage", "InspectionAuditSetDetailUserExecuteAfter successful");