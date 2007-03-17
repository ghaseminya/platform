/***************************************************************************
 * Copyright 2001-2006 The eXo Platform SARL         All rights reserved.  *
 * Please look at license.txt in info directory for more license detail.   *
 **************************************************************************/
package org.exoplatform.portletregistry.webui.component;

import org.exoplatform.organization.webui.component.UIPermissionSelector;
import org.exoplatform.portal.config.UserACL.Permission;
import org.exoplatform.services.portletregistery.Portlet;
import org.exoplatform.webui.application.RequestContext;
import org.exoplatform.webui.component.UIFormTabPane;
import org.exoplatform.webui.component.UIPopupWindow;
import org.exoplatform.webui.component.lifecycle.UIFormLifecycle;
import org.exoplatform.webui.config.annotation.ComponentConfig;
import org.exoplatform.webui.config.annotation.EventConfig;
import org.exoplatform.webui.event.Event;
import org.exoplatform.webui.event.EventListener;

/**
 * Created by The eXo Platform SARL
 * Author : Nguyen Thi Hoa
 *          hoa.nguyen@exoplatform.com
 * Sep 26, 2006  
 */

@ComponentConfig(
    lifecycle = UIFormLifecycle.class,
    template = "system:/groovy/webui/component/UIFormTabPane.gtmpl",
    events = @EventConfig(listeners = UIPermissionForm.SaveActionListener.class)
)
public class UIPermissionForm extends UIFormTabPane{
  
  public UIPermissionForm() throws Exception{
    super("UIPermissionForm", false);
    super.setInfoBar(false);
    super.setRenderResourceTabName(false) ;
    
    UIPermissionSelector uiPermissionSelector = createUIComponent(UIPermissionSelector.class, null, null);
    uiPermissionSelector.configure("Permission", null, null) ;
    uiPermissionSelector.createPermission("ViewPermission",null);
    uiPermissionSelector.setRendered(false);
    addUIComponentInput(uiPermissionSelector) ;
  }
  
  public void processRender(RequestContext context) throws Exception {
    super.processRender(context);   
    UIPermissionSelector uiPermissionSelector = getChild(UIPermissionSelector.class);    
    if(uiPermissionSelector == null) return;
    UIPopupWindow uiPopupWindow = uiPermissionSelector.getChild(UIPopupWindow.class);
    uiPopupWindow.processRender(context);
  }
  
  public void setValue(Portlet portlet) throws Exception {    
    UIPermissionSelector uiPermissionSelector = getChild(UIPermissionSelector.class);    
    Permission permission = uiPermissionSelector.getPermission("ViewPermission");
    if(portlet.getViewPermission()==null||portlet.getViewPermission().length()==0) {      
      permission.setMembership("");
      permission.setGroupId("");
    }else {
      permission.setPermissionExpression(portlet.getViewPermission());
    }    
  } 
  
  static public class SaveActionListener extends EventListener<UIPermissionForm> {    
    public void execute(Event<UIPermissionForm> event) throws Exception {
      UIPermissionForm  uiPermissionForm = event.getSource();
      UIWorkingArea uiWorkingArea = uiPermissionForm.getParent();
      UIPortletRegistryPortlet uiPRegistryPortlet= uiWorkingArea.getParent();
      UIPortletRegistryCategory uiPortletRegistryCategory = uiPRegistryPortlet.getChild(UIPortletRegistryCategory.class);
      Portlet portletSelected = uiPortletRegistryCategory.getSelectedPortlet() ;
      UIPermissionSelector uiPermissionSelector = uiPermissionForm.getChild(UIPermissionSelector.class);
      Permission permission = uiPermissionSelector.getPermission("ViewPermission");
      portletSelected.setViewPermission(permission.getValue());      
    }
  }



}
